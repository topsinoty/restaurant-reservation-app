package com.topsinoty.reservationSystem.config;

import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RestaurantTableRepository restaurantTableRepository;
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private int windowSeats = 0;

    public DataInitializer(RestaurantTableRepository restaurantTableRepository) {
        this.restaurantTableRepository = restaurantTableRepository;
    }

    @Override
    public void run(String @NonNull ... args) {

        if (restaurantTableRepository.count() > 0) {
            log.info("Did not generate any restaurant tables");
            return;
        }

        try {
            Random random = new Random();
            List<RestaurantTable> tables = new ArrayList<>();

            for (Position p : positions()) {
                RestaurantTable table = new RestaurantTable();
                table.setLocation(p.location());
                table.setX(p.x());
                table.setY(p.y());
                table.setCapacity(randomCapacity(random));
                table.setFeatures(featuresForPosition(p.location(), p.x(), p.y()));

                tables.add(table);
            }

            restaurantTableRepository.saveAll(tables);
            log.info("Generated {} tables", tables.size());

        } catch (Exception e) {
            log.error("Failed to generate restaurant tables", e);
        }
    }

    private int randomCapacity(Random random) {
        int[] capacities = {2, 3, 4, 6, 8, 10};
        return capacities[random.nextInt(capacities.length)];
    }

    private List<Position> positions() {

        return List.of(
                new Position(Location.CORNER, 0, 0), new Position(Location.CORNER, 0, 1),
                new Position(Location.CORNER, 0, 2), new Position(Location.CORNER, 0, 3),
                new Position(Location.CORNER, 0, 4), new Position(Location.CORNER, 1, 0),
                new Position(Location.CORNER, 2, 0), new Position(Location.CORNER, 3, 0),
                new Position(Location.CORNER, 4, 0), new Position(Location.CORNER, 5, 0),
                new Position(Location.CORNER, 6, 0), new Position(Location.CORNER, 7, 0),

                new Position(Location.CENTER, 2, 2), new Position(Location.CENTER, 2, 3),
                new Position(Location.CENTER, 2, 4), new Position(Location.CENTER, 3, 2),
                new Position(Location.CENTER, 3, 3), new Position(Location.CENTER, 3, 4),
                new Position(Location.CENTER, 4, 2), new Position(Location.CENTER, 4, 3),
                new Position(Location.CENTER, 4, 4),

                new Position(Location.OUTDOOR, 6, 1), new Position(Location.OUTDOOR, 6, 2),
                new Position(Location.OUTDOOR, 6, 3), new Position(Location.OUTDOOR, 6, 4),
                new Position(Location.OUTDOOR, 7, 1), new Position(Location.OUTDOOR, 7, 2),
                new Position(Location.OUTDOOR, 7, 3), new Position(Location.OUTDOOR, 7, 4)
        );
    }

    private Set<Feature> featuresForPosition(Location location, int x, int y) {

        Set<Feature> features = EnumSet.noneOf(Feature.class);
        Random random = new Random();

        if (x == 0 && y == 0) {
            features.add(Feature.ROMANTIC);
        }

        if (location == Location.OUTDOOR) {
            features.add(Feature.GREAT_VIEW);
        }

        if (location == Location.CENTER || location == Location.OUTDOOR) {
            features.add(Feature.BUSY);
        }

        if (location == Location.CORNER && !(x == 0 && y == 0) && windowSeats < 2) {
            features.add(Feature.WINDOW_SIDE);
            windowSeats++;
        }

        if (location == Location.CORNER && random.nextDouble() < 0.4) {
            features.add(Feature.QUIET);
        }

        if (location == Location.CENTER && random.nextDouble() < 0.3) {
            features.add(Feature.KIDS_AREA);
        }

        return features;
    }

    private record Position(Location location, int x, int y) {
    }
}