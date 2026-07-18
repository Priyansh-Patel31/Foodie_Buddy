package com.foodiebuddy.admin.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler to automatically reset the Shared Demo Environment database
 * back to its golden state every 30 minutes.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoResetScheduler {

    private final MongoTemplate mongoTemplate;
    private final DataInitializer dataInitializer;

    // Run every 30 minutes (1800000 ms)
    @Scheduled(fixedRate = 1800000)
    public void resetDemoDatabase() {
        log.info("Starting scheduled reset of Demo Database...");
        
        try {
            // Switch to demo context
            TenantContext.setDemo(true);
            
            // Drop the demo database entirely
            log.info("Dropping demo database...");
            mongoTemplate.getDb().drop();
            
            // Re-seed the golden dataset
            log.info("Re-seeding demo database...");
            dataInitializer.seedDatabase();
            
            log.info("Demo Database reset successfully.");
        } catch (Exception e) {
            log.error("Failed to reset demo database: {}", e.getMessage(), e);
        } finally {
            // Always clear context to avoid thread leaks
            TenantContext.clear();
        }
    }
}
