package com.foodiebuddy.admin.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;

/**
 * Registers the TenantAwareMongoDatabaseFactory into the Spring context,
 * overriding the auto-configured MongoDatabaseFactory.
 */
@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient(MongoProperties properties) {
        return MongoClients.create(properties.getUri());
    }

    @Bean
    @Primary
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient, MongoProperties properties) {
        return new TenantAwareMongoDatabaseFactory(mongoClient, properties.getMongoClientDatabase());
    }
}
