package com.topsinoty.reservationSystem.repository;

import com.topsinoty.reservationSystem.model.Reservation;
import org.springframework.data.repository.ListCrudRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends ListCrudRepository<Reservation, Long> {
    boolean doesNotExistsByRestaurantTableIdAndDateAndTimeBetween(Long tableId,
                                                           LocalDate date,
                                                           LocalTime start,
                                                           LocalTime end);
}
