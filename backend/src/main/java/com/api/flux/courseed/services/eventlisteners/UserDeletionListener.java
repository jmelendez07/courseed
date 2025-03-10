package com.api.flux.courseed.services.eventlisteners;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.ChangeStreamEvent;
import org.springframework.data.mongodb.core.ChangeStreamOptions;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.repositories.ReviewRepository;
import com.api.flux.courseed.persistence.repositories.ViewRepository;
import com.mongodb.ConnectionString;
import com.mongodb.client.model.changestream.ChangeStreamDocument;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoDatabase;

import jakarta.annotation.PostConstruct;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
public class UserDeletionListener {
    
    @Autowired
    private ReactiveMongoTemplate reactiveMongoTemplate;
    
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ViewRepository viewRepository;

    @Value("${MONGODB_URI}")
    private String mongoUri;

    @PostConstruct
    public void watchUserDeletions() {
        Flux<ChangeStreamEvent<Document>> changeStream = reactiveMongoTemplate
            .changeStream("users", ChangeStreamOptions.empty(), Document.class);
    }

    private String extractDatabaseName(String uri) {
        return new ConnectionString(uri).getDatabase();
    }
}
