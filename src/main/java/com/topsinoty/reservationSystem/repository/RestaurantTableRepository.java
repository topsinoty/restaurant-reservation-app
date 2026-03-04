package com.topsinoty.reservationSystem.repository;

import com.topsinoty.reservationSystem.model.RestaurantTable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RestaurantTableRepository extends ListCrudRepository<RestaurantTable, Long> {
    @Query("""
            SELECT t FROM RestaurantTable t
            WHERE t.capacity >= :capacity
            AND t.id NOT IN (
                SELECT r.restaurantTable.id
                FROM Reservation r
                WHERE r.date = :date 
                AND r.time < :endTime 
                AND r.endTime > :time
            ) 
            ORDER BY t.capacity
            """)
    List<RestaurantTable> findAvailableTables(@Param("capacity") int capacity,
                                              @Param("date") LocalDate date,
                                              @Param("time") LocalTime startTime,
                                              @Param("endTime") LocalTime endTime);

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
