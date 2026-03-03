package com.topsinoty.reservationSystem.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationBookingResponse(Long reservationId, Long tableId, LocalDate date, LocalTime time,
                                         Integer capacity) {
}
