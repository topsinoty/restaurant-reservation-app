package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.dto.reservation.ReservationCalendarResponse;
import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ReservationCalendarServiceTest {

    private final ReservationCalendarService reservationCalendarService = new ReservationCalendarService();

    @Test
    void generateInvite_buildsCalendarFileForReservationPreview() {
        RestaurantTable table = new RestaurantTable();
        table.setId(7L);
        table.setCapacity(4);
        table.setLocation(Location.CORNER);
        table.setFeatures(Set.of(Feature.QUIET));
        table.setX(0);
        table.setY(0);

        LocalDate date = LocalDate.of(2030, 6, 15);
        LocalTime startTime = LocalTime.of(18, 0);
        LocalTime endTime = LocalTime.of(20, 0);

        ReservationCalendarResponse result = reservationCalendarService.generateInvite(table, date, startTime, endTime,
                4);

        assertAll(
                () -> assertEquals("reservation-table-7-2030-06-15-18-00.ics", result.fileName()),
                () -> assertEquals("text/calendar;charset=utf-8", result.contentType()),
                () -> assertEquals("Restaurant reservation for 4 guests", result.summary()),
                () -> assertEquals("Table #7 (CORNER)", result.location()),
                () -> assertEquals(date, result.date()),
                () -> assertEquals(startTime, result.time()),
                () -> assertEquals(endTime, result.endTime()),
                () -> assertTrue(result.content().contains("BEGIN:VCALENDAR")),
                () -> assertTrue(result.content().contains("SUMMARY:Restaurant reservation for 4 guests")),
                () -> assertTrue(result.content().contains("LOCATION:Table #7 (CORNER)"))
        );
    }
}
