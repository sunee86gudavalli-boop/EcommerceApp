package com.josh.pros.BackEnd;

import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Iterable<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    public ProductEntity getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public ProductEntity getProductByName(String name) {
        return productRepository.findByName(name);
    }

    public ProductEntity saveProduct(ProductEntity product) {
        return productRepository.save(product);
    }
}
