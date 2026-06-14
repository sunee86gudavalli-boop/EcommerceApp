package com.josh.pros.BackEnd;

import org.springframework.stereotype.Service;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public Iterable<InventoryEntity> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public InventoryEntity saveInventory(InventoryEntity inventory) {
        return inventoryRepository.save(inventory);
    }

    public InventoryEntity getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProduct_Id(productId).orElse(null);
    }

    public void deleteInventory(Long inventoryId) {
        inventoryRepository.deleteById(inventoryId);
    }
}
