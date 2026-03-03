package com.topsinoty.reservationSystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationResponse(

        @NotNull
        Long id,

        @NotNull
        @Positive
        LocalTime time,

        @NotNull
        @Positive
        LocalDate date,

        @NotNull
        @Positive
        Integer people,

        @NotNull
        Long restaurant_table_id
) {
}