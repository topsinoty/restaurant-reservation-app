package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.ReservationResponse;
import com.topsinoty.reservationSystem.repository.ReservationRepository;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import com.topsinoty.reservationSystem.service.ReservationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationService reservationService,
                                 RestaurantTableRepository tableRepository,
                                 ReservationRepository reservationRepository) {
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("")
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(reservation -> new ReservationResponse(reservation.getId(), reservation.getTime(), reservation.getDate(), reservation.getPeople(), reservation.getRestaurantTable()
                        .getId()))
                .toList();
    }
}
