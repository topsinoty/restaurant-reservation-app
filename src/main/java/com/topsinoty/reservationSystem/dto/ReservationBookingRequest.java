package com.topsinoty.reservationSystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationBookingRequest(

        @NotNull Long tableId,

        @NotNull LocalDate date,

        @NotNull LocalTime time,

        @NotNull @Positive Integer people

) {
}
