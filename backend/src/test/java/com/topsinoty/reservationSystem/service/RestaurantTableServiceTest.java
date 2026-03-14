package com.topsinoty.reservationSystem.service;

import com.topsinoty.reservationSystem.dto.ApiResult;
import com.topsinoty.reservationSystem.dto.restaurantTable.RestaurantTableResponse;
import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RestaurantTableServiceTest {

    private RestaurantTableRepository tableRepository;
    private RestaurantTableService restaurantTableService;

    @BeforeEach
    void setUp() {
        tableRepository = mock(RestaurantTableRepository.class);
        restaurantTableService = new RestaurantTableService(tableRepository);
    }

    @Test
    void getAllTables_mapsRepositoryEntitiesToResponses() {
        RestaurantTable cornerTable = table(1L, 2, Location.CORNER, Set.of(Feature.QUIET, Feature.WINDOW_SIDE), 0, 1);
        RestaurantTable outdoorTable = table(2L, 6, Location.OUTDOOR, Set.of(Feature.GREAT_VIEW), 7, 4);

        when(tableRepository.findAll()).thenReturn(List.of(cornerTable, outdoorTable));

        ApiResult<List<RestaurantTableResponse>> result = restaurantTableService.getAllTables();

        assertEquals(2, result.data().size());
        assertIterableEquals(List.of(1L, 2L), result.data().stream().map(RestaurantTableResponse::id).toList());
        assertAll(() -> assertEquals(2, result.data()
                .getFirst()
                .capacity()), () -> assertEquals(Location.CORNER, result.data()
                .getFirst()
                .location()), () -> assertEquals(Set.of(Feature.QUIET, Feature.WINDOW_SIDE), result.data()
                .getFirst()
                .features()), () -> assertEquals(0, result.data().getFirst().x()), () -> assertEquals(1, result.data()
                .getFirst()
                .y()), () -> assertEquals(6, result.data()
                .get(1)
                .capacity()), () -> assertEquals(Location.OUTDOOR, result.data()
                .get(1)
                .location()), () -> assertEquals(Set.of(Feature.GREAT_VIEW), result.data()
                .get(1)
                .features()), () -> assertEquals(7, result.data().get(1).x()), () -> assertEquals(4, result.data()
                .get(1)
                .y()));
    }

    private RestaurantTable table(Long id, int capacity, Location location, Set<Feature> features, int x, int y) {
        RestaurantTable table = new RestaurantTable();
        table.setId(id);
        table.setCapacity(capacity);
        table.setLocation(location);
        table.setFeatures(features);
        table.setX(x);
        table.setY(y);
        return table;
    }

    @Test
    void getAllTables_returnsEmptyListWhenRepositoryIsEmpty() {
        when(tableRepository.findAll()).thenReturn(List.of());

        ApiResult<List<RestaurantTableResponse>> result = restaurantTableService.getAllTables();

        assertEquals(List.of(), result.data());
    }
}
