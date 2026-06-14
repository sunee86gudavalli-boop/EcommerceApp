import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Customer {
  customerId: number;
  name: string;
  email: string;
  password: string;
}

export interface CustomerResponse {
  customer: Customer;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface ProductResponse {
  product: Product;
}

export interface ProductsResponse {
  products: Product[];
}

export interface Order {
  id: number;
  name: string;
  totalItems: number | null;
  quantity: number;
  billAmount: number;
  customer: Customer | null;
  product: Product | null;
}

export interface OrdersCreateRequest {
  quantity: number;
  billAmount: number;
  productId: number;
  customerId: number;
}

export interface Inventory {
  inventoryId: number;
  stock: number;
  date: string;
  quantity: number;
  product: Product | null;
}

export interface InventoryResponse {
  inventory: Inventory;
}

export interface InventoriesResponse {
  inventories: Inventory[];
}

export interface InventoryCreateRequest {
  productName: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class Service {
  private apiNotificationUrl = 'http://localhost:8083/api/v1/notifications';
  private apiOrdersUrl = 'http://localhost:8083/api/v1/orders';
  private apiInventoryUrl = 'http://localhost:8083/api/v1/inventory';
  private apiUsersUrl = 'http://localhost:8083/api/v1/customers';
  private apiProductsUrl = 'http://localhost:8083/api/v1/products';

  constructor(private http: HttpClient) {}

  loggedInCustomerId = 0;
  setLoggedInCustomer(loggedInCustomerId: number) {
  this.loggedInCustomerId = loggedInCustomerId;
}

checkProductName(productName: string) {
  return this.http.get<any>(
    `${this.apiProductsUrl}/name/${productName}`
  );
}

  getLoggedInCustomer(){
    return this.loggedInCustomerId;
  }

  getNotification(): Observable<string> {
    return this.http.get(this.apiNotificationUrl, {
      responseType: 'text',
    });
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiOrdersUrl);
  }

  createOrder(order: OrdersCreateRequest): Observable<Order> {
    return this.http.post<Order>(this.apiOrdersUrl, order);
  }

  getInventory(): Observable<InventoriesResponse> {
    return this.http.get<InventoriesResponse>(this.apiInventoryUrl);
  }

  createInventory(productName: string, quantity: number, price: number): Observable<InventoryResponse> {
    const payload: InventoryCreateRequest = { productName, quantity, price };
    return this.http.post<InventoryResponse>(this.apiInventoryUrl, payload);
  }

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse | Product[]>(this.apiProductsUrl).pipe(
      map((response) => ({ products: this.normalizeProductsResponse(response) })),
    );
  }

  getProductByName(name: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiProductsUrl}/name/${name}`);
  }

  createProduct(product: Pick<Product, 'name' | 'price'>): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiProductsUrl, product);
  }

  getUsers(): Observable<string> {
    return this.http.get(`${this.apiUsersUrl}`, {
      responseType: 'text',
    });
  }

  getLoginUser(email: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUsersUrl}/username/${email}`);
  }

  private normalizeProductsResponse(
    response: { products?: Product[] | Iterable<Product> | null } | Product[],
  ): Product[] {
    if (Array.isArray(response)) {
      return response;
    }

    const products = response?.products;

    if (Array.isArray(products)) {
      return products;
    }

    if (products && Symbol.iterator in Object(products)) {
      return Array.from(products);
    }

    return [];
  }
}
