package com.api.flux.courseed.web.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.web.controllers.AuthController;
import com.api.flux.courseed.web.controllers.CategoryController;
import com.api.flux.courseed.web.controllers.ContentController;
import com.api.flux.courseed.web.controllers.CourseController;
import com.api.flux.courseed.web.controllers.InstitutionController;
import com.api.flux.courseed.web.controllers.LikeController;
import com.api.flux.courseed.web.controllers.ReviewController;
import com.api.flux.courseed.web.controllers.RoleController;
import com.api.flux.courseed.web.controllers.UserController;

@Configuration
public class RouterConfig {

    @Bean
    RouterFunction<ServerResponse> routes(
        AuthController authController, CategoryController categoryController,
        ContentController contentController, CourseController courseController,
        InstitutionController institutionController, LikeController likeController,
        ReviewController reviewController, UserController userController,
        RoleController roleController
    ) {
        return RouterFunctions.route()
            .path("/auth", () -> authRoutes(authController))
            .path("/categories", () -> categoryRoutes(categoryController))
            .path("/contents", () -> contentRoutes(contentController))
            .path("/courses", () -> courseRoutes(courseController))
            .path("/institutions", () -> institutionRoutes(institutionController))
            .path("/likes", () -> likeRoutes(likeController))
            .path("/reviews", () -> reviewRoutes(reviewController))
            .path("/users", () -> userRoutes(userController))
            .path("/roles", () -> roleRoutes(roleController))
            .build();
    }

    private RouterFunction<ServerResponse> authRoutes(AuthController authController) {
        return RouterFunctions
            .route()
            .GET(authController::getAuthUser)
            .POST("/login", authController::login)
            .POST("/register", authController::register)
            .PUT("/password", authController::updatePassword)
            .build();
    }

    private RouterFunction<ServerResponse> categoryRoutes(CategoryController categoryController) {
        return RouterFunctions
            .route()
            .GET("", categoryController::getAllCategories)
            .GET("/{id}", categoryController::getCategoryById)
            .GET("/name/{name}", categoryController::getCategoryByName)
            .POST(categoryController::createCategory)
            .PUT("/{id}", categoryController::updateCategory)
            .DELETE("/{id}", categoryController::deleteCategory)
            .build();
    }

    private RouterFunction<ServerResponse> contentRoutes(ContentController contentController) {
        return RouterFunctions
            .route()
            .GET("/{id}", contentController::getContentById)
            .GET("/course/{courseId}", contentController::getContentByCourseId)
            .POST(contentController::createContent)
            .PUT("/{id}", contentController::updateContent)
            .DELETE("/{id}", contentController::deleteContent)
            .build();
    }

    private RouterFunction<ServerResponse> courseRoutes(CourseController courseController) {
        return RouterFunctions
            .route()
            .GET("", courseController::getAllCourses)
            .GET("/search", courseController::searchCoursesByText)
            .GET("/{id}", courseController::getCourseById)
            .GET("/category/{categoryId}", courseController::getCoursesByCategoryId)
            .GET("/institution/{institutionId}", courseController::getCoursesByInstitutionId)
            .GET("/reviews-likes/count", courseController::getTopCoursesWithReviewsAndLikes)
            .POST(courseController::createCourse)
            .PUT("/{id}", courseController::updateCourse)
            .DELETE("/{id}", courseController::deleteCourse)
            .build();
    }

    private RouterFunction<ServerResponse> institutionRoutes(InstitutionController institutionController) {
        return RouterFunctions
            .route()
            .GET("", institutionController::getAllInstitutions)
            .GET("/{id}", institutionController::getInstitutionById)
            .GET("/name/{name}", institutionController::getInstitutionByName)
            .GET("/courses/count", institutionController::getInstitutionsWithCoursesCount)
            .POST(institutionController::createInstitution)
            .PUT("/{id}", institutionController::updateInstitution)
            .DELETE("/{id}", institutionController::deleteInstitution)
            .build();
    }

    private RouterFunction<ServerResponse> likeRoutes(LikeController likeController) {
        return RouterFunctions
            .route()
            .GET("/course/{courseId}", likeController::getLikesByCourseId)
            .GET("/auth", likeController::getLikesByAuthUser)
            .POST(likeController::createLike)
            .DELETE("/{id}", likeController::deleteLike)
            .build();
    }

    private RouterFunction<ServerResponse> reviewRoutes(ReviewController reviewController) {
        return RouterFunctions
            .route()
            .GET("/course/{courseId}", reviewController::getReviewsByCourseId)
            .GET("/auth", reviewController::getReviewsByAuthUser)
            .POST(reviewController::createReview)
            .PUT("/{id}", reviewController::updateReview)
            .DELETE("/{id}", reviewController::deleteReview)
            .build();
    }

    private RouterFunction<ServerResponse> userRoutes(UserController userController) {
        return RouterFunctions
            .route()
            .GET("", userController::getAllUsers)
            .GET("/{id}", userController::getUserById)
            .GET("/email/{email}", userController::getUserByEmail)
            .PUT("/email/{id}", userController::updateUserEmail)
            .PUT("/password/{id}", userController::updateUserPassword)
            .PUT("/roles/{id}", userController::updateUserRoles)
            .DELETE("/{id}", userController::deleteUser)
            .build();
    }

    private RouterFunction<ServerResponse> roleRoutes(RoleController roleController) {
        return RouterFunctions
            .route()
            .GET("", roleController::getAllRoles)
            .build();
    }

    @Bean
    AuthController authController() {
        return new AuthController();
    }

    @Bean
    CategoryController categoryController() {
        return new CategoryController();
    }

    @Bean
    ContentController contentController() {
        return new ContentController();
    }

    @Bean
    CourseController courseController() {
        return new CourseController();
    }

    @Bean
    InstitutionController institutionController() {
        return new InstitutionController();
    }

    @Bean
    LikeController likeController() {
        return new LikeController();
    }

    @Bean
    ReviewController reviewController() {
        return new ReviewController();
    }

    @Bean
    UserController userController() {
        return new UserController();
    }
    
    @Bean
    RoleController roleController() {
        return new RoleController();
    }
}
