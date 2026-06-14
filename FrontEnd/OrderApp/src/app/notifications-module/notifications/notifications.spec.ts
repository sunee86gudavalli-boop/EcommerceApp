import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Notifications } from './notifications';
import { Service } from '../../service/service';

describe('Notifications', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notifications],
      providers: [
        {
          provide: Service,
          useValue: {
            getNotification: () => of('Notification data'),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
