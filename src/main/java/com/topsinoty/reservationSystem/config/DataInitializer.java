package com.topsinoty.reservationSystem.config;

import com.topsinoty.reservationSystem.model.Feature;
import com.topsinoty.reservationSystem.model.Location;
import com.topsinoty.reservationSystem.model.RestaurantTable;
import com.topsinoty.reservationSystem.repository.RestaurantTableRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Random;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RestaurantTableRepository restaurantTableRepository;

    public DataInitializer(RestaurantTableRepository restaurantTableRepository) {
        this.restaurantTableRepository = restaurantTableRepository;
    }

    @Override
    public void run(String... args) {

        if (restaurantTableRepository.count() > 0) {
            System.out.println("Did not generate any restaurant tables");
            return;
        }

        Random random = new Random();

        for (int i = 0; i < 20; i++) {
            RestaurantTable table = new RestaurantTable();
            table.setCapacity(randomCapacity(random));
            table.setLocation(randomLocation(random));
            table.setFeatures(randomFeatures(random));
            restaurantTableRepository.save(table);
        }
        System.out.println("Generated 20 tables");
    }

    private int randomCapacity(Random random) {
        int[] capacities = {2, 3, 4, 6, 8, 10};
        return capacities[random.nextInt(capacities.length)];
    }

    private Location randomLocation(Random random) {
        Location[] locations = Location.values();
        return locations[random.nextInt(locations.length)];
    }

    private Set<Feature> randomFeatures(Random random) {
        Feature[] features = Feature.values();
        int numberOfFeatures = random.nextInt(features.length + 1);

        Set<Feature> selected = EnumSet.noneOf(Feature.class);

        for (int i = 0; i < numberOfFeatures; i++) {
            selected.add(features[random.nextInt(features.length)]);
        }

        return selected;
    }
}