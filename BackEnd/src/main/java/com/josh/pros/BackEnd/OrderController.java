package com.josh.pros.BackEnd;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.transaction.Transactional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;
    private final ProductService productService;
    private final CustomerService customerService;
    private final InventoryService inventoryService;

    public OrderController(
        OrderService orderService,
        ProductService productService,
        CustomerService customerService,
        InventoryService inventoryService
    ) {
        this.orderService = orderService;
        this.productService = productService;
        this.customerService = customerService;
        this.inventoryService = inventoryService;
    }

    @PostMapping
    @Transactional
    public OrderEntity saveOrder(@RequestBody OrderRequest orderRequest) {
        if (orderRequest.getQuantity() == null || orderRequest.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order quantity must be greater than zero");
        }

        ProductEntity product = productService.getProductById(orderRequest.getProductId());
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }

        CustomerEntity customer = customerService.getCustomerById(orderRequest.getCustomerId());
        if (customer == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }

        InventoryEntity inventory = inventoryService.getInventoryByProductId(product.getId());
        if (inventory == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is not available in inventory");
        }

        long currentStock = inventory.getStock() == null ? 0L : inventory.getStock();
        long requestedQuantity = orderRequest.getQuantity().longValue();

        if (currentStock < requestedQuantity) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Insufficient stock for product: " + product.getName()
            );
        }

        OrderEntity order = new OrderEntity();
        order.setQuantity(orderRequest.getQuantity());
        order.setBillAmount(product.getPrice() * requestedQuantity);
        order.setTotalItems(orderRequest.getQuantity() == null ? null : orderRequest.getQuantity().doubleValue());
        order.setProduct(product);
        order.setCustomer(customer);

        OrderEntity savedOrder = orderService.saveOrder(order);
        long remainingStock = currentStock - requestedQuantity;
        inventory.setStock(remainingStock);
        inventory.setQuantity(Math.toIntExact(remainingStock));
        inventory.setProduct(product);
        inventory.setDate(LocalDate.now());
        inventoryService.saveInventory(inventory);

        return savedOrder;
    }

    @GetMapping("/{id}")
    public OrderEntity getOrder(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @GetMapping
    public Iterable<OrderEntity> getOrders() {
        return orderService.getAllOrders();
    }

}
