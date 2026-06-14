import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Inventory } from './inventory';
import { Service } from '../../service/service';

describe('Inventory', () => {
  let component: Inventory;
  let fixture: ComponentFixture<Inventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inventory],
      providers: [
        {
          provide: Service,
          useValue: {
            getInventory: () => of({ inventories: [] }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inventory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
