package com.albertsons.productsearch.controller;

import com.albertsons.productsearch.model.Product;
import com.albertsons.productsearch.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*", allowedHeaders = "*") // Allow sync communication with Frontend
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /api/products
     * Queries, filters, and sorts Albertsons grocery products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "all") String department,
            @RequestParam(required = false, defaultValue = "false") Boolean organic,
            @RequestParam(required = false, defaultValue = "false") Boolean sale,
            @RequestParam(required = false, defaultValue = "false") Boolean glutenFree,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy
    ) {
        List<Product> products = productService.getProducts(
                query,
                department,
                organic,
                sale,
                glutenFree,
                sortBy
        );
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id}
     * Retrieves specific product details, or returns 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build(); // Standard 404 handler
        }
        return ResponseEntity.ok(product);
    }

    /**
     * POST /api/products
     * Inserts new product into H2 database
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        // Set deptId from category if not explicitly set
        if ((product.getDeptId() == null || product.getDeptId().trim().isEmpty()) && product.getCategory() != null) {
            product.setDeptId(product.getCategory());
        }
        // Provide standard defaults for UI consistency
        if (product.getRating() == null) product.setRating(5.0);
        if (product.getReviewsCount() == null) product.setReviewsCount(1);
        if (product.getImageUrl() == null || product.getImageUrl().trim().isEmpty()) {
            product.setImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600");
        }
        
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.status(201).body(savedProduct);
    }
}
