package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.dto.restaurantTable.RestaurantTableResponse;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantTableService {
    private final RestaurantTableRepository tableRepository;

    public RestaurantTableService(RestaurantTableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public List<RestaurantTableResponse> getAllTables() {
        return tableRepository.findAll()
                .stream()
                .map(t -> new RestaurantTableResponse(t.getId(), t.getCapacity(), t.getLocation(), t.getFeatures(), t.getX(), t.getY()))
                .toList();
    }

}
