package com.topsinoty.reservationSystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Data
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private Location location;
    private int capacity;

    @ElementCollection(targetClass = Feature.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "restaurant_table_features",
            joinColumns = @JoinColumn(name = "restaurant_table_id"))
    @Column(name = "feature")
    private Set<Feature> features;
}
