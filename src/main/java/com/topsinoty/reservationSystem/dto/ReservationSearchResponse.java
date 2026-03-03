package com.topsinoty.reservationSystem.dto;

import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;

import java.util.Set;

public record ReservationSearchResponse(Long id, Location location, Set<Feature> features, Integer capacity) {
}
