import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Inventory as InventoryItem, Product, Service } from '../../service/service';

@Component({
  selector: 'app-inventory',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  private readonly service = inject(Service);
  private readonly formBuilder = inject(FormBuilder);

  inventories: InventoryItem[] = [];
  products: Product[] = [];
  createErrorMessage = '';
  createSuccessMessage = '';

  readonly inventoryForm = this.formBuilder.group({
    productName: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    price: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.loadProducts();
    this.loadInventory();
  }

  addInventory(): void {
    this.createErrorMessage = '';
    this.createSuccessMessage = '';

    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    const productName = (this.inventoryForm.getRawValue().productName ?? '').trim();

    if (!productName) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    const quantity = Number(this.inventoryForm.getRawValue().quantity ?? 0);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    const price = Number(this.inventoryForm.getRawValue().price ?? 0);

    if (!Number.isFinite(price) || price <= 0) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    this.service.createInventory(productName, quantity, price).subscribe({
      next: () => {
        this.loadInventory();
        this.loadProducts();
        this.createSuccessMessage = 'Inventory updated successfully';
        this.inventoryForm.reset({ productName: '', quantity: 0 , price: 0});
      },
      error: (error: HttpErrorResponse) => {
        this.createErrorMessage = error.error?.message ?? 'Unable to update inventory';
      },
    });
  }

  private loadInventory(): void {
    this.service.getInventory().subscribe((response) => {
      this.inventories = response.inventories;
    });
  }

  private loadProducts(): void {
    this.service.getProducts().subscribe((response) => {
      this.products = response.products ?? [];
    });
  }
}
