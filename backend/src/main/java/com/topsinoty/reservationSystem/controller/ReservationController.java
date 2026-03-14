package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.ApiResult;
import com.topsinoty.reservationSystem.dto.reservation.*;
import com.topsinoty.reservationSystem.service.ReservationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private static final Logger log = LoggerFactory.getLogger(ReservationController.class);

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<ApiResult<List<ReservationResponse>>> getAllReservations() {
        List<ReservationResponse> reservations = reservationService.findAll();
        log.info("Fetched all reservations");
        return ResponseEntity.ok(ApiResult.success("Fetched all reservations", reservations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<ReservationResponse>> getReservationById(@PathVariable Long id) {
        ReservationResponse reservation = reservationService.findById(id);
        log.info("Fetched reservation {}", reservation);
        return ResponseEntity.ok(ApiResult.success("Fetched reservation %d".formatted(id), reservation));
    }

    @PostMapping("/available")
    public ResponseEntity<ApiResult<List<ReservationSearchResponse>>> getAvailableReservations(
            @Valid @RequestBody ReservationSearchRequest request) {

        List<ReservationSearchResponse> tables =
                reservationService.getPossibleTablesForReservation(request);
        log.info("Fetched available tables for reservations. x{}", tables.size());
        return ResponseEntity.ok(ApiResult.success("Fetched available tables", tables));
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResult<ReservationBookingResponse>> bookReservation(
            @Valid @RequestBody ReservationBookingRequest request) {

        ReservationBookingResponse booking = reservationService.bookReservation(request);
        String message = "Table #%d has been reserved for %s-%s".formatted(booking.table(), booking.time(),
                booking.time()
                .plusHours(2));
        log.info(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.success(message, booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservationById(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        log.info("Deleted reservation with id #{}", id);
        return ResponseEntity.noContent().build();
    }
}