package com.topsinoty.reservationSystem.dto.reservation;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationBookingRequest(

        @NotNull Long tableId,

        @NotNull @FutureOrPresent LocalDate date,

        @NotNull LocalTime time,

        @NotNull @Positive Integer people

) {
}
