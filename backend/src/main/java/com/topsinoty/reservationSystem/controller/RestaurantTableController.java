package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.ApiResult;
import com.topsinoty.reservationSystem.dto.restaurantTable.RestaurantTableResponse;
import com.topsinoty.reservationSystem.service.RestaurantTableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class RestaurantTableController {
    private final RestaurantTableService tableService;

    public RestaurantTableController(RestaurantTableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<ApiResult<List<RestaurantTableResponse>>> getTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }
}
