import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service, Order, Product, Inventory as InventoryItem } from '../../service/service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  imports: [ReactiveFormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private readonly service = inject(Service);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loggedInCustomerIdKey = 'loggedInCustomerId';

  products: Product[] = [];
  availableInventory: InventoryItem[] = [];
  orders: Order[] = [];
  loggedInCustomerId: number | null = null;
  productsLoadError = false;
  ordersLoadError = false;
  orderPlacedMessage = '';
  orderErrorMessage = '';

  readonly orderForm = this.formBuilder.group({
    productId: [null as number | null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    billAmount: [0, [Validators.required, Validators.min(0)]],
  });
  
  ngOnInit(): void {
    this.loggedInCustomerId = this.getLoggedInCustomerId();
    this.loadProducts();
    this.loadOrders();
  }

  get selectedProduct(): Product | undefined {
    const productId = this.orderForm.controls.productId.value;
    return this.products.find((product) => product.id === productId);
  }

  get selectedProductStock(): number | null {
    const productId = this.orderForm.controls.productId.value;
    if (productId === null) {
      return null;
    }

    return this.getStockForProduct(productId);
  }

  addOrder(): void {

    this.orderPlacedMessage = '';
    this.orderErrorMessage = '';

    if (this.loggedInCustomerId === null) {
      return;
    }

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const value = this.orderForm.getRawValue();

    for (const inventory of this.availableInventory) {
          if(inventory.product?.id === value.productId){
            const productQuantity = inventory.quantity;
            const quantity = value.quantity ?? 0;
            if (quantity > 0 && quantity > productQuantity) {
            alert("Inventory has Quantity: "+productQuantity +" but you have chosen "+value.quantity+" items, it is not possible to place the order");
          }
          }
        }

    

    this.service.createOrder({
      productId: value.productId as number,
      quantity: value.quantity ?? 0,
      billAmount: this.calculateBillAmount(value.productId, value.quantity),
      customerId: this.loggedInCustomerId,
    }).subscribe({
      next: (order) => {
        this.orders = [...this.orders, order];
        this.orderPlacedMessage = 'Order placed successfully';
        this.orderForm.reset({
          productId: null,
          quantity: 1,
          billAmount: 0,
        });
        this.loadProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.orderErrorMessage = error.error?.message ?? 'Unable to place order';
        this.orderPlacedMessage = '';
      },
    });
  }

  selectProduct(productId: number): void {
    this.orderForm.patchValue({
      productId,
      billAmount: this.calculateBillAmount(productId, this.orderForm.controls.quantity.value),
    });
  }

  onProductSelectionChange(productIdValue: string): void {
    const productId = Number(productIdValue);

    if (!Number.isFinite(productId)) {
      this.orderForm.patchValue({
        productId: null,
        billAmount: 0,
      });
      return;
    }

    this.selectProduct(productId);
  }

  onQuantityChange(quantityValue: string): void {
    const quantity = Number(quantityValue);
    const productId = this.orderForm.controls.productId.value;

    this.orderForm.patchValue({
      quantity: Number.isFinite(quantity) ? quantity : 0,
      billAmount: this.calculateBillAmount(productId, quantity),
    });
  }

  getOrderProductName(order: Order): string {
    return order.product?.name ?? 'No product';
  }

  getStockForProduct(productId: number): number {
    const inventory = this.availableInventory.find((item) => item.product?.id === productId);
    return inventory?.stock ?? 0;
  }

  private calculateBillAmount(
    productId: number | null,
    quantity: number | null | undefined,
  ): number {
    if (productId === null || !Number.isFinite(quantity ?? NaN) || (quantity ?? 0) <= 0) {
      return 0;
    }

    const product = this.products.find((item) => item.id === productId);
    return (product?.price ?? 0) * (quantity ?? 0);
  }

  private loadProducts(): void {
    this.productsLoadError = false;
    this.service.getInventory().subscribe({
      next: (response) => {
        const availableProducts = new Map<number, Product>();
        this.availableInventory = (response.inventories ?? []).filter(
          (inventory) => (inventory.stock ?? 0) > 0 && inventory.product !== null,
        );

        for (const inventory of this.availableInventory) {
          const product = inventory.product;
          if (product === null) {
            continue;
          }

          availableProducts.set(product.id, product);
        }

        this.products = Array.from(availableProducts.values());
        const selectedProductId = this.orderForm.controls.productId.value;
        if (selectedProductId !== null && !this.products.some((product) => product.id === selectedProductId)) {
          this.orderForm.patchValue({
            productId: null,
            billAmount: 0,
          });
        } else if (selectedProductId !== null) {
          this.orderForm.patchValue({
            billAmount: this.calculateBillAmount(
              selectedProductId,
              this.orderForm.controls.quantity.value,
            ),
          });
        }
      },
      error: () => {
        this.availableInventory = [];
        this.products = [];
        this.productsLoadError = true;
      },
    });
  }

  private loadOrders(): void {
    this.ordersLoadError = false;
    this.service.getOrders().subscribe({
      next: (orders) => {
        if (this.loggedInCustomerId === null) {
          this.orders = [];
          return;
        }

        this.orders = orders.filter(
          (order) => order.customer?.customerId === this.loggedInCustomerId,
        );
      },
      error: () => {
        this.orders = [];
        this.ordersLoadError = true;
      },
    });
  }

  private getLoggedInCustomerId(): number | null {
    const storedValue =
      globalThis.sessionStorage?.getItem(this.loggedInCustomerIdKey) ??
      globalThis.localStorage?.getItem(this.loggedInCustomerIdKey);

    if (!storedValue) {
      return null;
    }

    const customerId = Number(storedValue);
    return Number.isFinite(customerId) ? customerId : null;
  }
}
