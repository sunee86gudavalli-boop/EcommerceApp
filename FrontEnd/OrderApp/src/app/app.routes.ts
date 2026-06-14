import { Routes } from '@angular/router';
import { Orders } from './orders-module/orders/orders';
import { Inventory } from './inventory-module/inventory/inventory';
import { Notifications } from './notifications-module/notifications/notifications';
import { Products } from './products-module/products/products';


export const routes: Routes = [
    // { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'orders', component: Orders },
    { path: 'inventory', component: Inventory },
    { path: 'products', component: Products },
    { path: 'notifications', component: Notifications }  
];
