package com.topsinoty.reservationSystem.repository;

import com.topsinoty.reservationSystem.model.RestaurantTable;
import org.springframework.data.repository.ListCrudRepository;

public interface RestaurantTableRepository extends ListCrudRepository<RestaurantTable, Long> {
    @Query("""
            SELECT CASE WHEN COUNT(r) = 0 THEN true ELSE false END
            FROM Reservation r
            WHERE r.restaurantTable.id = :tableId
            AND r.date = :date
            AND r.time < :endTime
            AND r.endTime > :startTime
            """)
    boolean isTableFree(@Param("tableId") Long tableId,
                        @Param("date") LocalDate date,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime);
}
