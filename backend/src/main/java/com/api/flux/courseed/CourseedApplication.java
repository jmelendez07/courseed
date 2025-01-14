package com.api.flux.courseed;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableReactiveMongoAuditing;

@SpringBootApplication
@EnableReactiveMongoAuditing
public class CourseedApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourseedApplication.class, args);
	}

}
