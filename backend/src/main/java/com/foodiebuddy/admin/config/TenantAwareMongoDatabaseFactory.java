package com.foodiebuddy.admin.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.lang.NonNull;

/**
 * Custom MongoDatabaseFactory that dynamically routes to the demo database
 * if the TenantContext indicates a demo request.
 */
@Slf4j
public class TenantAwareMongoDatabaseFactory extends SimpleMongoClientDatabaseFactory {

    private final String demoDatabaseName;

    public TenantAwareMongoDatabaseFactory(MongoClient mongoClient, String defaultDatabaseName) {
        super(mongoClient, defaultDatabaseName);
        this.demoDatabaseName = defaultDatabaseName + "_demo";
        log.info("Initialized TenantAwareMongoDatabaseFactory. Default DB: {}, Demo DB: {}", defaultDatabaseName, demoDatabaseName);
    }

    @Override
    @NonNull
    public MongoDatabase getMongoDatabase() {
        if (TenantContext.isDemo()) {
            return super.getMongoDatabase(this.demoDatabaseName);
        }
        return super.getMongoDatabase();
    }
}
