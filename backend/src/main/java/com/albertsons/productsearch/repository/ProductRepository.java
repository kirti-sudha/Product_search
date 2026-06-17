package com.albertsons.productsearch.repository;

import com.albertsons.productsearch.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    // Case-insensitive wildcard searching by product name
    List<Product> findByNameContainingIgnoreCase(String name);

    // Filtering by department
    List<Product> findByDeptId(String deptId);

    // Filter by department and search query
    List<Product> findByDeptIdAndNameContainingIgnoreCase(String deptId, String name);
}
