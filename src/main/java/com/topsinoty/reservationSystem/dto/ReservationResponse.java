package com.topsinoty.reservationSystem.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationResponse(
        Long id,
        LocalTime time,
        LocalDate date,
        Integer people,
        Long restaurant_table_id
) {
}