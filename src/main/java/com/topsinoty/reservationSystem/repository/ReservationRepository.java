package com.topsinoty.reservationSystem.repository;

import com.topsinoty.reservationSystem.model.Reservation;
import org.springframework.data.repository.ListCrudRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends ListCrudRepository<Reservation, Long> {
    List<Reservation> findAllByRestaurantTableIdAndDate(Long restaurantTableId, LocalDate date);
}
