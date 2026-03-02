package com.topsinoty.reservationSystem.repository;

import com.topsinoty.reservationSystem.model.RestaurantTable;
import org.springframework.data.repository.ListCrudRepository;

public interface RestaurantTableRepository extends ListCrudRepository<RestaurantTable, Long> {
}
