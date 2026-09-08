package com.bloomscafe.catalog.service;

import com.bloomscafe.catalog.dto.ProductPageResponse;
import com.bloomscafe.catalog.exception.ResourceNotFoundException;
import com.bloomscafe.catalog.model.Category;
import com.bloomscafe.catalog.model.Product;
import com.bloomscafe.catalog.repository.CategoryRepository;
import com.bloomscafe.catalog.repository.ProductRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Cacheable(value = "product", key = "'batch:' + T(java.util.Arrays).toString(#ids.toArray())")
    @Transactional(readOnly = true)
    public List<Product> getProductsByIds(Collection<Long> ids) {
        return productRepository.findByIdIn(ids);
    }

    @Cacheable(value = "products", key = "#page + ':' + #size")
    @Transactional(readOnly = true)
    public ProductPageResponse getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return new ProductPageResponse(productRepository.findAll(pageable));
    }

    @Cacheable(value = "products", key = "#categoryId + ':' + #page + ':' + #size")
    @Transactional(readOnly = true)
    public ProductPageResponse getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return new ProductPageResponse(productRepository.findByCategoryId(categoryId, pageable));
    }

    @Cacheable(value = "product", key = "#id")
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findWithCategoryById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product Not Found with ID: " + id));
    }

    @CacheEvict(value = {"products"}, allEntries = true)
    @Transactional
    public Product createProduct(Product product) {
        Long categoryId = product.getCategory().getId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot create product. Category Not Found with ID: " + categoryId));
        product.setCategory(category);
        return productRepository.save(product);
    }

    @CacheEvict(value = {"products", "product"}, allEntries = true)
    @Transactional
    public void deleteProduct(Long id) {
        Product existingProduct = getProductById(id);
        productRepository.delete(existingProduct);
    }

    @CacheEvict(value = {"products", "product"}, allEntries = true)
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = getProductById(id);

        existingProduct.setName(productDetails.getName());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setStockQuantity(productDetails.getStockQuantity());
        existingProduct.setImageUrl(productDetails.getImageUrl());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category newCategory = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cannot update. New Category not found."));
            existingProduct.setCategory(newCategory);
        }

        return productRepository.save(existingProduct);
    }
}

