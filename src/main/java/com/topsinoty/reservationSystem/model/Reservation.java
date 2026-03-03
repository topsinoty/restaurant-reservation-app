package com.topsinoty.reservationSystem.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Positive
    private LocalTime time;
    @Positive
    private LocalDate date;
    @Positive
    private Integer people;
    @ManyToOne
    @JoinColumn(name = "restaurant_table_id", nullable = false)
    private RestaurantTable restaurantTable;
}
