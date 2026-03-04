package com.topsinoty.reservationSystem.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private LocalTime time;
    @NotNull
    private LocalTime endTime;
    @Future
    private LocalDate date;
    @Positive
    private Integer people;
    @ManyToOne
    @JoinColumn(name = "restaurant_table_id", nullable = false)
    private RestaurantTable restaurantTable;
}
