package com.josh.pros.BackEnd;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    public OrderEntity saveOrder(OrderEntity order) {
        return orderRepository.save(order);
    }

    public Iterable<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
    public OrderEntity getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
    

}
