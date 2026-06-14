package com.josh.pros.BackEnd;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProducts() {
        Map<String, Object> response = new HashMap<>();
        response.put("products", productService.getAllProducts());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        ProductEntity product = new ProductEntity();
        product.setName(productRequest.getName().trim());
        product.setPrice(productRequest.getPrice());

        InventoryEntity inventory = new InventoryEntity();
        inventory.setStock(1L);
        inventory.setDate(LocalDate.now());
        inventory.setQuantity(1);

        inventory.setProduct(product);
        product.setInventory(inventory);

        Map<String, Object> response = new HashMap<>();
        response.put("product", productService.saveProduct(product));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Map<String, Object>> getProductByName(@PathVariable String name) {
        Map<String, Object> response = new HashMap<>();
        response.put("products", productService.getProductByName(name));
        return ResponseEntity.ok(response);
    }
    
}
