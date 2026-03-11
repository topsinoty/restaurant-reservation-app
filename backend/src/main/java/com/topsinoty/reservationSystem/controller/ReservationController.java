package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.ApiResult;
import com.topsinoty.reservationSystem.dto.reservation.*;
import com.topsinoty.reservationSystem.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<ApiResult<List<ReservationResponse>>> getAllReservations() {
        List<ReservationResponse> reservations = reservationService.findAll();
        return ResponseEntity.ok(ApiResult.success(reservations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<ReservationResponse>> getReservationById(@PathVariable Long id) {
        ReservationResponse reservation = reservationService.findById(id);
        return ResponseEntity.ok(ApiResult.success(reservation));
    }

    @PostMapping("/available")
    public ResponseEntity<ApiResult<List<ReservationSearchResponse>>> getAvailableReservations(
            @Valid @RequestBody ReservationSearchRequest request) {

        List<ReservationSearchResponse> tables =
                reservationService.getPossibleTablesForReservation(request);

        return ResponseEntity.ok(ApiResult.success(tables));
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResult<ReservationBookingResponse>> bookReservation(
            @Valid @RequestBody ReservationBookingRequest request) {

        ReservationBookingResponse booking = reservationService.bookReservation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResult.success(booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservationById(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }
}