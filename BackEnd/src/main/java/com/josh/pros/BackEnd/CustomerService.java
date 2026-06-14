package com.josh.pros.BackEnd;

import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    public Iterable<CustomerEntity> getAllCustomers() {
        return customerRepository.findAll();
    }
    public CustomerEntity getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }
    public CustomerEntity saveCustomer(CustomerEntity customer) {
        return customerRepository.save(customer);
    }
    public CustomerEntity getCustomerByUsername(String username) {
        return customerRepository.findByEmail(username);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }


}
