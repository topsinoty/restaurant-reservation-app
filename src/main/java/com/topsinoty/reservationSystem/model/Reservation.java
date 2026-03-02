package com.topsinoty.reservationSystem.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalTime time;
    private LocalDate date;
    private Integer people;
    @OneToOne(mappedBy = "restaurant_table")
    @JoinColumn(name = "restaurant_table_id", nullable = false)
    private RestaurantTable table;
}
