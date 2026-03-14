package com.topsinoty.reservationSystem.dto.reservation;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationCalendarResponse(
        String fileName,
        String contentType,
        String content,
        String summary,
        String location,
        LocalDate date,
        LocalTime time,
        LocalTime endTime
) {
}
