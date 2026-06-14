package com.josh.pros.BackEnd;

import lombok.Data;

@Data
public class OrderRequest {
    private Integer quantity;
    private Double billAmount;
    private Long productId;
    private Long customerId;
}
