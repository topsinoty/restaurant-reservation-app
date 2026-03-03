package com.topsinoty.reservationSystem.dto;

import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;

import java.util.Set;

public record ReservationSearchResponse(Long id, Location location, Set<Feature> features, Integer capacity) {
}

/*
*     @Id
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

    @OneToMany(mappedBy = "restaurantTable")
    private Set<Reservation> reservations;
* */