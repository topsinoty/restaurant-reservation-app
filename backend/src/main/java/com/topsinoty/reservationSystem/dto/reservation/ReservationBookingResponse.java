package com.topsinoty.reservationSystem.dto.reservation;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationBookingResponse(Long id, LocalDate date, LocalTime time, Integer capacity, Long table) {
}
