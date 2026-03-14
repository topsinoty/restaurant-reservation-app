package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.dto.reservation.ReservationCalendarResponse;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import net.fortuna.ical4j.data.CalendarOutputter;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.*;
import net.fortuna.ical4j.model.property.immutable.ImmutableCalScale;
import net.fortuna.ical4j.model.property.immutable.ImmutableVersion;
import net.fortuna.ical4j.util.RandomUidGenerator;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class ReservationCalendarService {

    private static final String CONTENT_TYPE = "text/calendar;charset=utf-8";
    private static final String PRODUCT_ID = "-//topsinoty//restaurant-reservation-system//EN";
    private static final Version VERSION = ImmutableVersion.VERSION_2_0;
    private static final CalScale CALENDAR_SCALE = ImmutableCalScale.GREGORIAN;

    public ReservationCalendarResponse generateInvite(RestaurantTable table,
                                                      LocalDate date,
                                                      LocalTime time,
                                                      LocalTime endTime,
                                                      Integer people) {

        String tableLocation = "Table #%d (%s)".formatted(table.getId(), table.getLocation().name());
        String summaryText = "Restaurant reservation for %d guest%s".formatted(people, people==1 ? "":"s");
        String descriptionText = """
                Reservation details:
                Table: #%d
                Zone: %s
                Party size: %d
                Time: %s-%s
                """.formatted(table.getId(), table.getLocation().name(), people, time, endTime);

        var event = new VEvent(LocalDateTime.of(date, time), LocalDateTime.of(date, endTime), summaryText);
        event.add(new DtStamp(Instant.now()));
        event.add(new Uid(new RandomUidGenerator().generateUid().getValue()));
        event.add(new Description(descriptionText));
        event.add(new Location(tableLocation));

        Calendar calendar = new Calendar();
        calendar.add(new ProdId(PRODUCT_ID));
        calendar.add(VERSION);
        calendar.add(CALENDAR_SCALE);
        calendar.add(event);

        return new ReservationCalendarResponse(buildFileName(table.getId(), date, time), CONTENT_TYPE,
                serialize(calendar), summaryText, tableLocation, date, time, endTime);
    }

    private String buildFileName(Long tableId, LocalDate date, LocalTime time) {
        return "reservation-table-%d-%s-%s.ics".formatted(tableId, date, time.toString().replace(":", "-"));
    }

    private String serialize(Calendar calendar) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            new CalendarOutputter().output(calendar, outputStream);
            return outputStream.toString(StandardCharsets.UTF_8);
        } catch (IOException | RuntimeException e) {
            throw new IllegalStateException("Failed to generate calendar invite", e);
        }
    }
}
