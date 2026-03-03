package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.ReservationBookingRequest;
import com.topsinoty.reservationSystem.dto.ReservationBookingResponse;
import com.topsinoty.reservationSystem.dto.ReservationSearchRequest;
import com.topsinoty.reservationSystem.dto.ReservationSearchResponse;
import com.topsinoty.reservationSystem.model.Reservation;
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
    public List<ReservationSearchResponse> getAvailableTables(@RequestBody @Valid ReservationSearchRequest req) {
        List<RestaurantTable> availableTables = reservationService.getAvailableTables(req.date(), req.time(), req.people(), Optional.ofNullable(req.preferredFeatures()), Optional.ofNullable(req.location()));
        return availableTables.stream()
                .map(table -> new ReservationSearchResponse(table.getId(), table.getLocation(), table.getFeatures(), table.getCapacity()))
                .toList();
    }

    @PostMapping("/book")
    public ReservationBookingResponse bookTable(@RequestBody @Valid ReservationBookingRequest req) {
        System.out.println(req.toString());
        Reservation reservation = reservationService.bookTable(req.id(), req.date(), req.time(), req.people());
        return new ReservationBookingResponse(reservation.getId(), reservation.getRestaurantTable()
                .getId(), reservation.getDate(), reservation.getTime(), reservation.getPeople());
    }

}
