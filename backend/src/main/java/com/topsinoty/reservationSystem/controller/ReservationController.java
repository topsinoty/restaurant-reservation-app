package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.reservation.*;
import com.topsinoty.reservationSystem.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// todo add proper http codes

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<ReservationResponse> getAllReservations() {
        return reservationService.findAll();
    }

    @GetMapping("/{id}")
    public ReservationResponse getReservationById(@PathVariable Long id) {
        return reservationService.findById(id);
    }

    @PostMapping("/available")
    public List<ReservationSearchResponse> getAvailableReservations(@Valid @RequestBody ReservationSearchRequest reservationSearchRequest) {
        return reservationService.getPossibleTablesForReservation(reservationSearchRequest);
    }

    @PostMapping("/book")
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationBookingResponse bookReservation(@Valid @RequestBody ReservationBookingRequest request) {
        return reservationService.bookReservation(request);
    }

    @DeleteMapping("/cancel/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReservationById(@PathVariable Long id) {
        reservationService.cancelReservation(id);
    }
}
