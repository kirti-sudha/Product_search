package com.albertsons.productsearch.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    private String name;
    private String brand;
    private String category;
    private Double price;

    @Column(name = "original_price")
    private Double originalPrice;

    private Double rating;

    @Column(name = "reviews_count")
    private Integer reviewsCount;

    @Column(name = "is_organic")
    private Boolean isOrganic;

    @Column(name = "is_sale")
    private Boolean isSale;

    private String size;

    @Column(name = "is_gluten_free")
    private Boolean isGlutenFree;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @Column(name = "dept_id")
    private String deptId;
}
