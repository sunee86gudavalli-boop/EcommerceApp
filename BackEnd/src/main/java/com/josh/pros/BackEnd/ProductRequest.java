package com.josh.pros.BackEnd;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Product price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Product price must be greater than or equal to zero")
    private Double price;
}
