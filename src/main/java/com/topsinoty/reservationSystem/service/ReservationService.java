package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.repository.ReservationRepository;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    private static final int RESERVATION_DURATION_HOURS = 2;

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
    public List<ReservationSearchResponse> getPossibleTablesForReservation(ReservationSearchRequest req) {
        ToIntFunction<RestaurantTable> countFeatureMatch = restaurantTable -> countMatchingFeatures(restaurantTable, req.preferredFeatures());

        return tableRepository.findAvailableTables(req.people(), req.date(), req.time(), req.time()
                        .plus(Duration.ofHours(2)))
                .stream()
                .map(r -> new ReservationSearchResponse(r.getId(), r.getLocation(), r.getFeatures(), r.getCapacity()))
                .toList();
    }
}