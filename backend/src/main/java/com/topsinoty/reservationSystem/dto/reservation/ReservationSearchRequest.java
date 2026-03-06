package com.topsinoty.reservationSystem.dto.reservation;


import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

public record ReservationSearchRequest(

        @NotNull
        LocalDate date,

        @NotNull
        LocalTime time,

        @NotNull
        @Positive
        Integer people,

        Set<Feature> preferredFeatures,

        Location location
) {}