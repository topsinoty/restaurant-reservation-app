package com.topsinoty.reservationSystem.controller;

import com.topsinoty.reservationSystem.dto.ApiResult;
import com.topsinoty.reservationSystem.dto.restaurantTable.RestaurantTableResponse;
import com.topsinoty.reservationSystem.service.RestaurantTableService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(RestaurantTableController.class);

    @GetMapping
    public ResponseEntity<ApiResult<List<RestaurantTableResponse>>> getTables() {
        log.info("Fetch all tables");
        return ResponseEntity.ok(tableService.getAllTables());
    }
}
