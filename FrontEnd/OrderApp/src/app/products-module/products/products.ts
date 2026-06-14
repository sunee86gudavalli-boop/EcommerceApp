import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, Service } from '../../service/service';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private readonly service = inject(Service);
  private readonly formBuilder = inject(FormBuilder);

  

  products: Product[] = [];
  createErrorMessage = '';
  createSuccessMessage = '';

  readonly productForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  addProduct(): void {
    this.createErrorMessage = '';
    this.createSuccessMessage = '';


    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const name = (value.name ?? '').trim();

    for (const product of this.products) {
      if(product.name === name){
        alert(" this.products "+product.name +" Already exists");
      }
    }

    
    

    if (!name) {
      this.productForm.controls.name.setErrors({ required: true });
      this.productForm.markAllAsTouched();
      return;
    }

    console.log(" price :"+value.price);
    

    this.service.createProduct({
      name,
      price: value.price ?? 0,
    }).subscribe({
      next: (response) => {
        this.products = [...this.products, response.product];
        this.createSuccessMessage = 'Product added successfully';
        this.productForm.reset({
          name: '',
          price: 0,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.createErrorMessage = error.error?.message ?? 'Unable to add product';
      },
    });
  }

  private loadProducts(): void {
    this.service.getProducts().subscribe((response) => {
      this.products = response.products ?? [];
    });
  }
}
