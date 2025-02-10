package com.api.flux.courseed;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableReactiveMongoAuditing;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableReactiveMongoAuditing
public class CourseedApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		System.setProperty("SERVER_PORT", dotenv.get("SERVER_PORT"));
		System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));
		System.setProperty("ADMIN_EMAIL", dotenv.get("ADMIN_EMAIL"));
		System.setProperty("ADMIN_PASS", dotenv.get("ADMIN_PASS"));
		
		SpringApplication.run(CourseedApplication.class, args);
	}

}
