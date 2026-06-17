package com.albertsons.productsearch.service;

import com.albertsons.productsearch.model.Product;
import com.albertsons.productsearch.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Retrieve and search products based on criteria
     */
    public List<Product> getProducts(
            String query,
            String deptId,
            Boolean isOrganic,
            Boolean isSale,
            Boolean isGlutenFree,
            String sortBy
    ) {
        List<Product> products;

        // Fetch subsets from DB to minimize RAM footprint
        if (deptId != null && !deptId.equalsIgnoreCase("all") && !deptId.isEmpty()) {
            if (query != null && !query.trim().isEmpty()) {
                products = productRepository.findByDeptIdAndNameContainingIgnoreCase(deptId, query);
            } else {
                products = productRepository.findByDeptId(deptId);
            }
        } else if (query != null && !query.trim().isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(query);
        } else {
            products = productRepository.findAll();
        }

        // Apply filters in Java streams for refined filters
        Stream<Product> productStream = products.stream();

        if (isOrganic != null && isOrganic) {
            productStream = productStream.filter(Product::getIsOrganic);
        }

        if (isSale != null && isSale) {
            productStream = productStream.filter(Product::getIsSale);
        }

        if (isGlutenFree != null && isGlutenFree) {
            productStream = productStream.filter(Product::getIsGlutenFree);
        }

        // Apply sorting criteria
        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "price-low":
                    productStream = productStream.sorted(Comparator.comparing(Product::getPrice));
                    break;
                case "price-high":
                    productStream = productStream.sorted(Comparator.comparing(Product::getPrice).reversed());
                    break;
                case "name-az":
                    productStream = productStream.sorted(Comparator.comparing(Product::getName));
                    break;
                case "relevance":
                default:
                    // Default relevance sorts by rating (highest first) then reviews count
                    productStream = productStream.sorted(
                        Comparator.comparing(Product::getRating).reversed()
                                  .thenComparing(Product::getReviewsCount).reversed()
                    );
                    break;
            }
        }

        return productStream.collect(Collectors.toList());
    }

    /**
     * Fetch a product by unique ID
     */
    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    /**
     * Create and save a new product
     */
    public Product saveProduct(Product product) {
        if (product.getId() == null || product.getId().trim().isEmpty()) {
            product.setId("prod-" + System.currentTimeMillis());
        }
        return productRepository.save(product);
    }
}
