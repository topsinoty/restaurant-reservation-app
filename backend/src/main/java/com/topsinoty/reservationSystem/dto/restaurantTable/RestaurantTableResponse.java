package com.topsinoty.reservationSystem.dto.restaurantTable;

import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;

import java.util.Set;

public record RestaurantTable(Long id, Integer capacity, Location location, Set<Feature> features) {
}
