import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Customer, Service } from './service/service';

@Component({
  selector: 'app-root',
  imports: [RouterLink,RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('OrderApp');
  private readonly loggedInCustomerIdKey = 'loggedInCustomerId';
  private readonly loggedInCustomerKey = 'loggedInCustomer';

  isUserLoggedIn = false;
  loggedInCustomerId: number | null = null;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.loggedInCustomerId = this.getStoredCustomerId();
    this.isUserLoggedIn = this.loggedInCustomerId !== null;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.clearStoredCustomer();
      this.loggedInCustomerId = null;
      this.isUserLoggedIn = false;
      return;
    }

    const loginRequest = this.getLoginRequest();

    if (loginRequest.email && loginRequest.password) {
      this.service.getLoginUser(loginRequest.email).subscribe({
        next: (data) => {
          const customer = data?.customer;
          const customerId = this.toCustomerId(customer?.customerId);

          if (
            customer &&
            customerId !== null &&
            this.normalizeEmail(customer.email) === loginRequest.email &&
            customer.password === loginRequest.password
          ) {
            this.storeCustomer({
              ...customer,
              customerId,
            });
            this.loggedInCustomerId = customerId;
            this.service.setLoggedInCustomer(customerId);
            this.isUserLoggedIn = true;
            return;
          }

          this.clearStoredCustomer();
          this.loggedInCustomerId = null;
          this.isUserLoggedIn = false;
        },
        error: () => {
          this.clearStoredCustomer();
          this.loggedInCustomerId = null;
          this.isUserLoggedIn = false;
        },
      });
    }
  }

  logout(): void {
    this.clearStoredCustomer();
    this.service.setLoggedInCustomer(0);
    this.loginForm.reset({
      email: '',
      password: '',
    });
    this.loggedInCustomerId = null;
    this.isUserLoggedIn = false;
    void this.router.navigateByUrl('/');
  }

  private getLoginRequest(): { email: string; password: string } {
    const rawValue = this.loginForm.getRawValue();

    return {
      email: this.normalizeEmail(rawValue.email),
      password: (rawValue.password ?? '').trim(),
    };
  }

  private getStoredCustomerId(): number | null {
    const storedValue =
      globalThis.sessionStorage?.getItem(this.loggedInCustomerIdKey) ??
      globalThis.localStorage?.getItem(this.loggedInCustomerIdKey);

    if (!storedValue) {
      return null;
    }

    const customerId = Number(storedValue);
    return Number.isFinite(customerId) ? customerId : null;
  }

  private toCustomerId(customerId: unknown): number | null {
    const parsedCustomerId = Number(customerId);
    return Number.isFinite(parsedCustomerId) ? parsedCustomerId : null;
  }

  private normalizeEmail(email: string | null | undefined): string {
    return (email ?? '').trim().toLowerCase();
  }

  private storeCustomerId(customerId: number): void {
    globalThis.localStorage?.setItem(this.loggedInCustomerIdKey, String(customerId));
    globalThis.sessionStorage?.setItem(this.loggedInCustomerIdKey, String(customerId));
  }

  private storeCustomer(customer: Customer): void {
    this.storeCustomerId(customer.customerId);
    globalThis.localStorage?.setItem(this.loggedInCustomerKey, JSON.stringify(customer));
    globalThis.sessionStorage?.setItem(this.loggedInCustomerKey, JSON.stringify(customer));
  }

  private clearStoredCustomerId(): void {
    globalThis.localStorage?.removeItem(this.loggedInCustomerIdKey);
    globalThis.sessionStorage?.removeItem(this.loggedInCustomerIdKey);
  }

  private clearStoredCustomer(): void {
    this.clearStoredCustomerId();
    globalThis.localStorage?.removeItem(this.loggedInCustomerKey);
    globalThis.sessionStorage?.removeItem(this.loggedInCustomerKey);
  }
}
