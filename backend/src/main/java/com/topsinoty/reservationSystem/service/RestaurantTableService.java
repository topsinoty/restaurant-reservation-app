package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

@Service
public class RestaurantTableService {
    private final RestaurantTableRepository tableRepository;
    public RestaurantTableService(RestaurantTableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }


}
