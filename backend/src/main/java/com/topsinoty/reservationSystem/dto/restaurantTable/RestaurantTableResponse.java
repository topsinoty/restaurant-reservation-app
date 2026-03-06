package com.topsinoty.reservationSystem.dto.restaurantTable;

import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;

import java.util.Set;

public record RestaurantTableResponse(Long id, Integer capacity, Location location, Set<Feature> features, Integer x,
                                      Integer y) {
}
