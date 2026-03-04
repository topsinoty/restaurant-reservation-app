package com.topsinoty.reservationSystem.repository;

import com.topsinoty.reservationSystem.model.Reservation;
import org.springframework.data.repository.ListCrudRepository;

public interface ReservationRepository extends ListCrudRepository<Reservation, Long> {
}
