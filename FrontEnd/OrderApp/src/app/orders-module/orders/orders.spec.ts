import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Orders } from './orders';
import { Service } from '../../service/service';

describe('Orders', () => {
  let component: Orders;
  let fixture: ComponentFixture<Orders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orders],
      providers: [
        {
          provide: Service,
          useValue: {
            getProducts: () => of({ products: [] }),
            getOrders: () => of([]),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
