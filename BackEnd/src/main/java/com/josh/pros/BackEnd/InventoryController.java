package com.josh.pros.BackEnd;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/inventory")
public class InventoryController {
    private final InventoryService inventoryService;
    private final ProductService productService;

    public InventoryController(InventoryService inventoryService, ProductService productService) {
        this.inventoryService = inventoryService;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getInventory() {
        Map<String, Object> response = new HashMap<>();
        response.put("inventories", inventoryService.getAllInventory());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInventory(@Valid @RequestBody InventoryRequest inventoryRequest) {
        String productName = inventoryRequest.getProductName().trim();
        long quantityToAdd = inventoryRequest.getQuantity().longValue();

        ProductEntity product = productService.getProductByName(productName);

        if (product == null) {
            product = new ProductEntity();
            product.setName(productName);
        }

        product.setPrice(inventoryRequest.getPrice());
        product = productService.saveProduct(product);

        InventoryEntity inventory = inventoryService.getInventoryByProductId(product.getId());

        if (inventory == null) {
            inventory = new InventoryEntity();
            inventory.setProduct(product);
            inventory.setStock(quantityToAdd);
        } else {
            inventory.setProduct(product);
            inventory.setStock((inventory.getStock() == null ? 0L : inventory.getStock()) + quantityToAdd);
        }

        inventory.setQuantity(Math.toIntExact(inventory.getStock()));
        inventory.setDate(LocalDate.now());

        InventoryEntity savedInventory = inventoryService.saveInventory(inventory);

        Map<String, Object> response = new HashMap<>();
        response.put("inventory", savedInventory);
        return ResponseEntity.ok(response);
    }
}
