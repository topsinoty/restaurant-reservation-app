package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;
import com.topsinoty.reservationSystem.model.Reservation;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.ReservationRepository;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;
import java.util.function.ToIntFunction;

@Service
public class ReservationService {

    private static final long RESERVATION_DURATION_HOURS = 2;

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;

    public ReservationService(ReservationRepository reservationRepository, RestaurantTableRepository tableRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }

    public List<RestaurantTable> getAvailableTables(LocalDate date,
                                                    LocalTime requestedBookingStartTime,
                                                    int people,
                                                    Optional<Set<Feature>> preferredFeatures,
                                                    Optional<Location> location) {

        Set<Feature> requestedFeatures = preferredFeatures.orElse(Set.of());

        Predicate<RestaurantTable> filterByLocation = restaurantTable -> location.map(value -> restaurantTable.getLocation()
                .equals(value)).orElse(true);

        Predicate<RestaurantTable> filterByCapacity = restaurantTable -> restaurantTable.getCapacity() >= people;
        Predicate<RestaurantTable> filterByAvailability = restaurantTable -> isTableFree(restaurantTable.getId(), date, requestedBookingStartTime);
        ToIntFunction<RestaurantTable> countFeatureMatch = restaurantTable -> countMatchingFeatures(restaurantTable, requestedFeatures);

        Comparator<RestaurantTable> sortByFeatureMatchThenCapacity = Comparator.comparingInt(countFeatureMatch)
                .reversed()
                .thenComparingInt(RestaurantTable::getCapacity);

        return tableRepository.findAll()
                .stream()
                .filter(filterByLocation)
                .filter(filterByCapacity)
                .filter(filterByAvailability)
                .sorted(sortByFeatureMatchThenCapacity)
                .toList();
    }

    private boolean isTableFree(Long tableId, LocalDate date, LocalTime requestedBookingStartTime) {

        LocalTime requestedBookingEndTime = requestedBookingStartTime.plusHours(RESERVATION_DURATION_HOURS);

        List<Reservation> reservations = reservationRepository.findAllByRestaurantTableIdAndDate(tableId, date);

        for (Reservation reservation : reservations) {

            LocalTime existingBookingStartTime = reservation.getTime();
            LocalTime existingBookingEndTime = existingBookingStartTime.plusHours(RESERVATION_DURATION_HOURS);

            boolean bookingTimeOverlaps = existingBookingStartTime.isBefore(requestedBookingEndTime) && existingBookingEndTime.isAfter(requestedBookingStartTime);

            if (bookingTimeOverlaps) {
                return false;
            }
        }

        return true;
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