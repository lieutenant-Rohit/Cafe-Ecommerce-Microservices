package com.bloomscafe.catalog.config;

import com.bloomscafe.catalog.model.Category;
import com.bloomscafe.catalog.model.Product;
import com.bloomscafe.catalog.repository.CategoryRepository;
import com.bloomscafe.catalog.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Seeds the database with categories and products on startup.
 * Only runs if the products table is empty (fresh database).
 *
 * Image URLs point to /images/products/<name>.jpg which are served
 * by the frontend's nginx from the public/images/products/ directory.
 */
@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(
            CategoryRepository categoryRepository,
            ProductRepository productRepository) {

        return args -> {
            // Only seed if database is empty
            if (productRepository.count() > 0) {
                return;
            }

            System.out.println("Seeding database with categories and products...");

            // Create categories
            Category coffee = categoryRepository.save(new Category(null, "Coffee"));
            Category tea = categoryRepository.save(new Category(null, "Tea"));
            Category pastries = categoryRepository.save(new Category(null, "Pastries"));
            Category desserts = categoryRepository.save(new Category(null, "Desserts"));
            Category breakfast = categoryRepository.save(new Category(null, "Breakfast"));
            Category sandwiches = categoryRepository.save(new Category(null, "Sandwiches"));
            Category smoothies = categoryRepository.save(new Category(null, "Smoothies & Juices"));

            // Helper to build image URL
            java.util.function.Function<String, String> img = name -> "/images/products/" + name + ".jpg";

            // Coffee products
            List<Product> coffeeProducts = List.of(
                    new Product(null, "Espresso", new BigDecimal("120"), 50, img.apply("espresso"), coffee),
                    new Product(null, "Latte", new BigDecimal("150"), 50, img.apply("latte"), coffee),
                    new Product(null, "Cappuccino", new BigDecimal("140"), 50, img.apply("cappuccino"), coffee),
                    new Product(null, "Mocha", new BigDecimal("160"), 40, img.apply("mocha"), coffee),
                    new Product(null, "Cold Brew", new BigDecimal("150"), 30, img.apply("cold-brew"), coffee),
                    new Product(null, "Chai Latte", new BigDecimal("130"), 35, img.apply("chai-latte"), coffee),
                    new Product(null, "Matcha Latte", new BigDecimal("180"), 25, img.apply("matcha-latte"), coffee)
            );

            // Tea products
            List<Product> teaProducts = List.of(
                    new Product(null, "Earl Grey", new BigDecimal("99"), 60, img.apply("earl-grey"), tea),
                    new Product(null, "Green Tea", new BigDecimal("99"), 60, img.apply("green-tea"), tea)
            );

            // Pastry products
            List<Product> pastryProducts = List.of(
                    new Product(null, "Croissant", new BigDecimal("120"), 40, img.apply("croissant"), pastries),
                    new Product(null, "Cinnamon Roll", new BigDecimal("140"), 30, img.apply("cinnamon-roll"), pastries),
                    new Product(null, "Blueberry Muffin", new BigDecimal("110"), 35, img.apply("blueberry-muffin"), pastries),
                    new Product(null, "Scone", new BigDecimal("100"), 25, img.apply("scone"), pastries),
                    new Product(null, "Banana Bread", new BigDecimal("110"), 20, img.apply("banana-bread"), pastries)
            );

            // Dessert products
            List<Product> dessertProducts = List.of(
                    new Product(null, "Tiramisu", new BigDecimal("250"), 20, img.apply("tiramisu"), desserts),
                    new Product(null, "Chocolate Cake", new BigDecimal("220"), 20, img.apply("chocolate-cake"), desserts),
                    new Product(null, "Carrot Cake", new BigDecimal("220"), 20, img.apply("carrot-cake"), desserts),
                    new Product(null, "Cheesecake", new BigDecimal("250"), 15, img.apply("cheesecake"), desserts)
            );

            // Breakfast products
            List<Product> breakfastProducts = List.of(
                    new Product(null, "Eggs Benedict", new BigDecimal("280"), 20, img.apply("eggs-benedict"), breakfast),
                    new Product(null, "Pancakes", new BigDecimal("220"), 25, img.apply("pancakes"), breakfast),
                    new Product(null, "Oatmeal", new BigDecimal("150"), 30, img.apply("oatmeal"), breakfast),
                    new Product(null, "Avocado Toast", new BigDecimal("240"), 25, img.apply("avocado-toast"), breakfast),
                    new Product(null, "Granola Parfait", new BigDecimal("200"), 20, img.apply("granola-parfait"), breakfast),
                    new Product(null, "Yogurt Bowl", new BigDecimal("180"), 25, img.apply("yogurt-bowl"), breakfast),
                    new Product(null, "Fruit Salad", new BigDecimal("150"), 30, img.apply("fruit-salad"), breakfast)
            );

            // Sandwich products
            List<Product> sandwichProducts = List.of(
                    new Product(null, "Turkey Club", new BigDecimal("280"), 20, img.apply("turkey-club"), sandwiches),
                    new Product(null, "Grilled Cheese", new BigDecimal("200"), 25, img.apply("grilled-cheese"), sandwiches),
                    new Product(null, "Veggie Wrap", new BigDecimal("240"), 25, img.apply("veggie-wrap"), sandwiches)
            );

            // Smoothie & Juice products
            List<Product> smoothieProducts = List.of(
                    new Product(null, "Mango Smoothie", new BigDecimal("180"), 30, img.apply("mango-smoothie"), smoothies),
                    new Product(null, "Strawberry Milkshake", new BigDecimal("180"), 25, img.apply("strawberry-milkshake"), smoothies),
                    new Product(null, "Orange Juice", new BigDecimal("120"), 40, img.apply("orange-juice"), smoothies),
                    new Product(null, "Iced Lemonade", new BigDecimal("100"), 35, img.apply("iced-lemonade"), smoothies)
            );

            // Save all products
            productRepository.saveAll(coffeeProducts);
            productRepository.saveAll(teaProducts);
            productRepository.saveAll(pastryProducts);
            productRepository.saveAll(dessertProducts);
            productRepository.saveAll(breakfastProducts);
            productRepository.saveAll(sandwichProducts);
            productRepository.saveAll(smoothieProducts);

            System.out.println("Seeding complete! Inserted " + productRepository.count() + " products across " + categoryRepository.count() + " categories.");
        };
    }
}
