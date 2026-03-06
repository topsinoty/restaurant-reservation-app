package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.dto.reservation.*;
import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Reservation;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.ReservationRepository;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.function.Predicate;
import java.util.function.ToDoubleFunction;

@Service
public class ReservationService {

    private static final Duration RESERVATION_DURATION = Duration.ofHours(2);

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;

    public ReservationService(ReservationRepository reservationRepository, RestaurantTableRepository tableRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }

    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(r -> new ReservationResponse(r.getId(), r.getTime(), r.getDate(), r.getPeople(), r.getRestaurantTable()
                        .getId()))
                .sorted(Comparator.comparingInt(ReservationResponse::people))
                .toList();
    }

    public ReservationResponse findById(Long id) throws NoSuchElementException {
        return reservationRepository.findById(id)
                .map(r -> new ReservationResponse(r.getId(), r.getTime(), r.getDate(), r.getPeople(), r.getRestaurantTable()
                        .getId()))
                .orElseThrow(() -> new NoSuchElementException("Reservation not found with id: " + id));
    }

    @Transactional
    public ReservationBookingResponse bookReservation(ReservationBookingRequest request)
            throws IllegalStateException, NoSuchElementException {
        LocalTime endTime = request.time().plus(RESERVATION_DURATION);

        boolean tableFree = tableRepository.isTableFree(request.tableId(), request.date(), request.time(), endTime);

        if (!tableFree) {
            throw new IllegalStateException("Table is not available for the selected time");
        }

        RestaurantTable table = tableRepository.findById(request.tableId())
                .orElseThrow(() -> new NoSuchElementException("Table not found with id: " + request.tableId()));

        if (request.people() > table.getCapacity()) {
            throw new IllegalStateException("Table capacity is too small for the requested size");
        }

        Reservation reservation = new Reservation();
        reservation.setTime(request.time());
        reservation.setEndTime(endTime);
        reservation.setDate(request.date());
        reservation.setPeople(request.people());
        reservation.setRestaurantTable(table);

        Reservation saved = reservationRepository.save(reservation);

        return new ReservationBookingResponse(saved.getId(), saved.getDate(), saved.getTime(), saved.getPeople(), saved.getRestaurantTable()
                .getId());
    }

    @Transactional
    public void cancelReservation(Long id) throws NoSuchElementException {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reservation not found with id: " + id));

        reservationRepository.delete(reservation);
    }

    public List<ReservationSearchResponse> getPossibleTablesForReservation(ReservationSearchRequest req) {
        Set<Feature> preferred = (req.preferredFeatures()==null) ? Set.of():req.preferredFeatures();
        ToDoubleFunction<RestaurantTable> countFeatureMatch = table -> countMatchingFeatures(table, preferred);

        Comparator<RestaurantTable> sortByFeatureMatchThenCapacity = Comparator.comparingDouble(countFeatureMatch)
                .reversed()
                .thenComparingInt(RestaurantTable::getCapacity);
        Predicate<RestaurantTable> filterByLocationIfLocationIsPresent = t -> req.location()==null || t.getLocation()
                .equals(req.location());

        LocalTime endTime = req.time().plus(RESERVATION_DURATION);

        return tableRepository.findAvailableTables(req.people(), req.date(), req.time(), endTime)
                .stream().filter(filterByLocationIfLocationIsPresent)
                .sorted(sortByFeatureMatchThenCapacity)
                .map(t -> new ReservationSearchResponse(t.getId(), t.getLocation(), t.getFeatures(), t.getCapacity()))
                .toList();
    }
    private long countMatchingFeatures(RestaurantTable table, Set<Feature> requestedFeatures) {

        if (requestedFeatures.isEmpty() || table.getFeatures()==null || table.getFeatures().isEmpty()) {
            return 0;
        }
        return requestedFeatures.stream().filter(table.getFeatures()::contains).count();
    }
}