package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.dto.*;
import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Reservation;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.ReservationRepository;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.function.ToIntFunction;

@Service
public class ReservationService {

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

    public ReservationResponse findById(Long id) throws HttpClientErrorException.NotFound {
        return reservationRepository.findById(id)
                .map(r -> new ReservationResponse(r.getId(), r.getTime(), r.getDate(), r.getPeople(), r.getRestaurantTable()
                        .getId()))
                .orElseThrow();
    }

    public ReservationBookingResponse bookReservation(ReservationBookingRequest request)
            throws HttpClientErrorException.BadRequest {
        boolean tableFree = tableRepository.isTableFree(request.tableId(), request.date(), request.time(), request.time()
                .plus(Duration.ofHours(2)));

        if (!tableFree) {
            return null;
        }

        RestaurantTable table = tableRepository.findById(request.tableId()).orElseThrow();

        Reservation reservation = new Reservation();
        reservation.setTime(request.time());
        reservation.setEndTime(request.time().plus(Duration.ofHours(2)));
        reservation.setDate(request.date());
        reservation.setPeople(request.people());
        reservation.setRestaurantTable(table);

        Reservation saved = reservationRepository.save(reservation);

        return new ReservationBookingResponse(saved.getId(), saved.getDate(), saved.getTime(), saved.getPeople(), saved.getRestaurantTable()
                .getId());
    }

    public List<ReservationSearchResponse> getPossibleTablesForReservation(ReservationSearchRequest req) {
        ToIntFunction<RestaurantTable> countFeatureMatch = restaurantTable -> countMatchingFeatures(restaurantTable, req.preferredFeatures());
        Comparator<RestaurantTable> sortByFeatureMatchThenCapacity = Comparator.comparingInt(countFeatureMatch)
                .reversed()
                .thenComparingInt(RestaurantTable::getCapacity);

        return tableRepository.findAvailableTables(req.people(), req.date(), req.time(), req.time()
                        .plus(Duration.ofHours(2)))
                .stream()
                .sorted(sortByFeatureMatchThenCapacity)
                .map(r -> new ReservationSearchResponse(r.getId(), r.getLocation(), r.getFeatures(), r.getCapacity()))
                .toList();
    }

    private int countMatchingFeatures(RestaurantTable restaurantTable, Set<Feature> requestedFeatures) {

        if (requestedFeatures.isEmpty() || restaurantTable.getFeatures()==null || restaurantTable.getFeatures()
                .isEmpty()) {
            return 0;
        }

        int matchingFeatureCount = 0;

        for (Feature feature : requestedFeatures) {
            if (restaurantTable.getFeatures().contains(feature)) {
                matchingFeatureCount++;
            }
        }

        return matchingFeatureCount;
    }
}