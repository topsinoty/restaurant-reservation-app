package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.ReservationSearchRequest;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import com.topsinoty.reservationSystem.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService, RestaurantTableRepository tableRepository) {
        this.reservationService = reservationService;
    }

    @PostMapping("")
    public List<RestaurantTable> getAvailableTables(@RequestBody @Valid ReservationSearchRequest req) {
        return reservationService.getAvailableTables(req.date(), req.time(), req.expectedPeople(), Optional.ofNullable(req.preferredFeatures()), Optional.ofNullable(req.location()));
    }

}
