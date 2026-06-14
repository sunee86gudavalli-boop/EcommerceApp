import { ChangeDetectorRef, Component } from '@angular/core';
import { Service } from '../../service/service';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  notificationData: string = '';

  constructor(private service: Service, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.service.getNotification().subscribe((data) => {
      this.notificationData = data;
      this.cd.detectChanges();
  });
  }

}
