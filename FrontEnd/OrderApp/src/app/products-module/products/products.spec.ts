import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Products } from './products';
import { Service } from '../../service/service';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        {
          provide: Service,
          useValue: {
            getProducts: () => of({ products: [] }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
