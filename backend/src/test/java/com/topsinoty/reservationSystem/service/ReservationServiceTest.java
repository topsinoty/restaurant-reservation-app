package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.dto.reservation.*;
import com.topsinoty.reservationSystem.exception.ApiException;
import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;
import com.topsinoty.reservationSystem.model.Reservation;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.ReservationRepository;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    private ReservationRepository reservationRepository;
    private RestaurantTableRepository tableRepository;
    private ReservationService reservationService;

    @BeforeEach
    void setUp() {
        reservationRepository = mock(ReservationRepository.class);
        tableRepository = mock(RestaurantTableRepository.class);
        reservationService = new ReservationService(reservationRepository, tableRepository);
    }

    @Test
    void findAll_mapsReservationsAndSortsByPartySize() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        Reservation largerParty = makeReservation(11L, 6, date, LocalTime.of(19, 0), 3L);
        Reservation smallerParty = makeReservation(12L, 2, date, LocalTime.of(18, 0), 15L);

        when(reservationRepository.findAll()).thenReturn(List.of(largerParty, smallerParty));

        List<ReservationResponse> result = reservationService.findAll();

        assertEquals(2, result.size());
        assertIterableEquals(List.of(12L, 11L), result.stream().map(ReservationResponse::id).toList());
        assertIterableEquals(List.of(2, 6), result.stream().map(ReservationResponse::people).toList());
        assertIterableEquals(List.of(15L, 3L), result.stream().map(ReservationResponse::restaurant_table_id).toList());
        assertIterableEquals(List.of(LocalTime.of(18, 0), LocalTime.of(19, 0)), result.stream()
                .map(ReservationResponse::time)
                .toList());
    }

    private Reservation makeReservation(Long id, int people, LocalDate date, LocalTime time, Long tableId) {
        Reservation reservation = new Reservation();
        reservation.setId(id);
        reservation.setPeople(people);
        reservation.setDate(date);
        reservation.setTime(time);
        reservation.setEndTime(time.plusHours(2));
        reservation.setRestaurantTable(makeTable(tableId, Math.max(people, 2), Location.CENTER, Set.of(Feature.QUIET)));
        return reservation;
    }

    private RestaurantTable makeTable(Long id, int capacity, Location location, Set<Feature> features) {
        RestaurantTable table = new RestaurantTable();
        table.setId(id);
        table.setCapacity(capacity);
        table.setLocation(location);
        table.setFeatures(features);
        table.setX(0);
        table.setY(0);
        return table;
    }

    @Test
    void findById_returnsMappedReservation() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        Reservation reservation = makeReservation(25L, 4, date, LocalTime.of(18, 30), 1L);

        when(reservationRepository.findById(25L)).thenReturn(Optional.of(reservation));

        ReservationResponse result = reservationService.findById(25L);

        assertAll(() -> assertEquals(25L, result.id()), () -> assertEquals(date, result.date()),
                () -> assertEquals(LocalTime.of(18, 30), result.time()), () -> assertEquals(4, result.people()),
                () -> assertEquals(1L, result.restaurant_table_id()));
    }

    @Test
    void findById_throwsNotFoundWhenReservationDoesNotExist() {
        when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

        ApiException error = assertThrows(ApiException.class, () -> reservationService.findById(99L));

        assertEquals(HttpStatus.NOT_FOUND, error.status());
        assertEquals("Reservation not found with id: 99", error.getMessage());
    }

    @Test
    void bookReservation_savesReservationWithTwoHourEndTime() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        LocalTime time = LocalTime.of(18, 0);
        ReservationBookingRequest request = new ReservationBookingRequest(7L, date, time, 4);
        RestaurantTable table = makeTable(7L, 4, Location.CORNER, Set.of(Feature.QUIET));

        when(tableRepository.isTableFree(7L, date, time, time.plusHours(2))).thenReturn(true);
        when(tableRepository.findById(7L)).thenReturn(Optional.of(table));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(inv -> {
            Reservation reservation = inv.getArgument(0);
            reservation.setId(500L);
            return reservation;
        });

        ReservationBookingResponse result = reservationService.bookReservation(request);

        ArgumentCaptor<Reservation> reservationCaptor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(reservationCaptor.capture());
        Reservation savedReservation = reservationCaptor.getValue();

        assertAll(() -> assertEquals(500L, result.id()), () -> assertEquals(date, result.date()),
                () -> assertEquals(time, result.time()), () -> assertEquals(4, result.people()),
                () -> assertEquals(7L, result.table()), () -> assertEquals(date, savedReservation.getDate()),
                () -> assertEquals(time, savedReservation.getTime()), () -> assertEquals(time.plusHours(2),
                        savedReservation.getEndTime()), () -> assertEquals(4, savedReservation.getPeople()),
                () -> assertSame(table, savedReservation.getRestaurantTable()));
    }

    @Test
    void bookReservation_throwsConflictWhenTableIsAlreadyBooked() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        LocalTime time = LocalTime.of(18, 0);
        ReservationBookingRequest request = new ReservationBookingRequest(7L, date, time, 4);

        when(tableRepository.isTableFree(7L, date, time, time.plusHours(2))).thenReturn(false);

        ApiException error = assertThrows(ApiException.class, () -> reservationService.bookReservation(request));

        assertEquals(HttpStatus.CONFLICT, error.status());
        assertEquals("Table is not available for the selected time", error.getMessage());
        verify(tableRepository, never()).findById(any());
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void bookReservation_throwsNotFoundWhenTableDoesNotExist() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        LocalTime time = LocalTime.of(18, 0);
        ReservationBookingRequest request = new ReservationBookingRequest(99L, date, time, 4);

        when(tableRepository.isTableFree(99L, date, time, time.plusHours(2))).thenReturn(true);
        when(tableRepository.findById(99L)).thenReturn(Optional.empty());

        ApiException error = assertThrows(ApiException.class, () -> reservationService.bookReservation(request));

        assertEquals(HttpStatus.NOT_FOUND, error.status());
        assertEquals("Table not found with id: 99", error.getMessage());
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void bookReservation_throwsBadRequestWhenPartyExceedsCapacity() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        LocalTime time = LocalTime.of(18, 0);
        ReservationBookingRequest request = new ReservationBookingRequest(7L, date, time, 6);
        RestaurantTable table = makeTable(7L, 4, Location.CENTER, Set.of(Feature.ROMANTIC));

        when(tableRepository.isTableFree(7L, date, time, time.plusHours(2))).thenReturn(true);
        when(tableRepository.findById(7L)).thenReturn(Optional.of(table));

        ApiException error = assertThrows(ApiException.class, () -> reservationService.bookReservation(request));

        assertEquals(HttpStatus.BAD_REQUEST, error.status());
        assertEquals("Table capacity is too small for the requested size", error.getMessage());
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void cancelReservation_deletesExistingReservation() {
        Reservation reservation = makeReservation(41L, 2, LocalDate.of(2030, 6, 15), LocalTime.of(17, 0), 301L);

        when(reservationRepository.findById(41L)).thenReturn(Optional.of(reservation));

        reservationService.cancelReservation(41L);

        verify(reservationRepository).delete(reservation);
    }

    @Test
    void cancelReservation_throwsNotFoundWhenReservationDoesNotExist() {
        when(reservationRepository.findById(77L)).thenReturn(Optional.empty());

        ApiException error = assertThrows(ApiException.class, () -> reservationService.cancelReservation(77L));

        assertEquals(HttpStatus.NOT_FOUND, error.status());
        assertEquals("Reservation not found with id: 77", error.getMessage());
    }

    @Test
    void getPossibleTablesForReservation_filtersByLocationAndRanksByFeatureMatchBeforeCapacity() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        LocalTime time = LocalTime.of(18, 0);
        ReservationSearchRequest request = new ReservationSearchRequest(date, time, 4, Set.of(Feature.QUIET,
                Feature.WINDOW_SIDE), Location.CORNER);

        RestaurantTable bestSmallerFit = makeTable(5L, 5, Location.CORNER, Set.of(Feature.QUIET, Feature.WINDOW_SIDE));
        RestaurantTable bestLargerFit = makeTable(1L, 6, Location.CORNER, Set.of(Feature.QUIET, Feature.WINDOW_SIDE));
        RestaurantTable partialMatch = makeTable(2L, 4, Location.CORNER, Set.of(Feature.QUIET));
        RestaurantTable noMatch = makeTable(3L, 3, Location.CORNER, null);
        RestaurantTable wrongLocation = makeTable(4L, 2, Location.CENTER, Set.of(Feature.QUIET, Feature.WINDOW_SIDE));

        when(tableRepository.findAvailableTables(4, date, time, time.plusHours(2))).thenReturn(List.of(partialMatch,
                wrongLocation, noMatch, bestLargerFit, bestSmallerFit));

        List<ReservationSearchResponse> result = reservationService.getPossibleTablesForReservation(request);

        assertEquals(4, result.size());
        assertIterableEquals(List.of(5L, 1L, 2L, 3L), result.stream().map(ReservationSearchResponse::id).toList());
        assertIterableEquals(List.of(5, 6, 4, 3), result.stream().map(ReservationSearchResponse::capacity).toList());
        assertIterableEquals(List.of(2L, 2L, 1L, 0L), result.stream().map(this::featureMatchCount).toList());
        assertNull(result.get(3).features());
        verify(tableRepository).findAvailableTables(4, date, time, time.plusHours(2));
    }

    private long featureMatchCount(ReservationSearchResponse response) {
        if (response.features()==null) {
            return 0;
        }

        return response.features()
                .stream()
                .filter(feature -> feature==Feature.QUIET || feature==Feature.WINDOW_SIDE)
                .count();
    }

    @Test
    void getPossibleTablesForReservation_sortsByCapacityWhenPreferencesAreMissing() {
        LocalDate date = LocalDate.of(2030, 6, 15);
        LocalTime time = LocalTime.of(18, 0);
        ReservationSearchRequest request = new ReservationSearchRequest(date, time, 2, null, null);

        RestaurantTable largest = makeTable(10L, 6, Location.CENTER, Set.of(Feature.ROMANTIC));
        RestaurantTable smallest = makeTable(11L, 2, Location.OUTDOOR, Set.of(Feature.GREAT_VIEW));
        RestaurantTable middle = makeTable(12L, 4, Location.CORNER, null);

        when(tableRepository.findAvailableTables(2, date, time, time.plusHours(2))).thenReturn(List.of(largest,
                smallest, middle));

        List<ReservationSearchResponse> result = reservationService.getPossibleTablesForReservation(request);

        assertIterableEquals(List.of(11L, 12L, 10L), result.stream().map(ReservationSearchResponse::id).toList());
        assertIterableEquals(List.of(2, 4, 6), result.stream().map(ReservationSearchResponse::capacity).toList());
        assertNull(result.get(1).features());
    }
}
