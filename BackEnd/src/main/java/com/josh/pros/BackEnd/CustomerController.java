package com.josh.pros.BackEnd;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCustomers() {
        Map<String, Object> response = new HashMap<>();
        response.put("customers", customerService.getAllCustomers());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCustomerById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        CustomerEntity customer = customerService.getCustomerById(id);
        response.put("customer", customer);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/username/{email}")
    public ResponseEntity<Map<String, Object>> getCustomerByUsername(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        CustomerEntity customer = customerService.getCustomerByUsername(email);

        if (customer == null) {
            response.put("message", "Customer not found for email: " + email);
            response.put("customer", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("customer", customer);
        return ResponseEntity.ok(response);
    }

    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCustomer(@RequestBody CustomerEntity customer) {
        Map<String, Object> response = new HashMap<>();
        CustomerEntity savedCustomer = new CustomerEntity();
        savedCustomer.setEmail(customer.getEmail());
        savedCustomer.setName(customer.getName());
        savedCustomer.setPassword(customer.getPassword());
        System.out.println("Creating customer: " + savedCustomer.getEmail()+" "+savedCustomer.getName()+" "+savedCustomer.getPassword());

        savedCustomer = customerService.saveCustomer(savedCustomer);
        response.put("customer", savedCustomer);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCustomer(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        customerService.deleteCustomer(id);
        response.put("message", "Customer with ID: " + id + " deleted");
        return ResponseEntity.ok(response);
    }

}
