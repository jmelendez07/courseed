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
import com.api.flux.courseed.web.controllers.PaymentController;
import com.api.flux.courseed.web.controllers.ReactionController;
import com.api.flux.courseed.web.controllers.ReviewController;
import com.api.flux.courseed.web.controllers.RoleController;
import com.api.flux.courseed.web.controllers.SearchHistoryController;
import com.api.flux.courseed.web.controllers.UserController;
import com.api.flux.courseed.web.controllers.ViewController;

@Configuration
public class RouterConfig {

    @Bean
    RouterFunction<ServerResponse> routes(
        AuthController authController, CategoryController categoryController,
        ContentController contentController, CourseController courseController,
        InstitutionController institutionController, ViewController viewController,
        ReviewController reviewController, UserController userController,
        RoleController roleController, ReactionController reactionController,
        SearchHistoryController searchHistoryController, PaymentController paymentController
    ) {
        return RouterFunctions.route()
            .path("/auth", () -> authRoutes(authController))
            .path("/categories", () -> categoryRoutes(categoryController))
            .path("/contents", () -> contentRoutes(contentController))
            .path("/courses", () -> courseRoutes(courseController))
            .path("/institutions", () -> institutionRoutes(institutionController))
            .path("/reviews", () -> reviewRoutes(reviewController))
            .path("/users", () -> userRoutes(userController))
            .path("/roles", () -> roleRoutes(roleController))
            .path("/reactions", () -> reactionRoutes(reactionController))
            .path("/views", () -> viewRoutes(viewController))
            .path("/search-histories", () -> searchHistoryRoutes(searchHistoryController))
            .path("/payu", () -> payURoutes(paymentController))
            .build();
    }

    private RouterFunction<ServerResponse> authRoutes(AuthController authController) {
        return RouterFunctions
            .route()
            .GET(authController::getAuthUser)
            .POST("/login", authController::login)
            .POST("/register", authController::register)
            .POST("/register/subscriptor", authController::registerSubscriptor)
            .PUT("/password", authController::updatePassword)
            .PUT("/profile", authController::updateProfile)
            .PUT("/subscribe", authController::subscribe)
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
            .GET("/auth", courseController::getCoursesByAuthUser)
            .GET("/search", courseController::searchCoursesByText)
            .GET("/reviews/avg", courseController::getTopCoursesWithRatingAvg)
            .GET("/{id}", courseController::getCourseById)
            .GET("/category/{categoryId}", courseController::getCoursesByCategoryId)
            .GET("/institution/{institutionId}", courseController::getCoursesByInstitutionId)
            .GET("/reviews-reactions/count", courseController::getTopCoursesWithReviewsAndReactions)
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

    private RouterFunction<ServerResponse> reactionRoutes(ReactionController reactionController) {
        return RouterFunctions
            .route()
            .GET("/course/{courseId}", reactionController::findReactionsByCourseId)
            .GET("/auth", reactionController::findReactionsByAuthUser)
            .GET("/total/this-month", reactionController::getTotalReactions)
            .POST(reactionController::createReaction)
            .PUT(reactionController::updateReaction)
            .DELETE("/{id}", reactionController::deleteReaction)
            .build();
    }

    private RouterFunction<ServerResponse> reviewRoutes(ReviewController reviewController) {
        return RouterFunctions
            .route()
            .GET("", reviewController::getAllReviews)
            .GET("/months/count", reviewController::getReviewCountsForLastSixMonths)
            .GET("/total/this-month", reviewController::getTotalReviews)
            .GET("/total/negative", reviewController::getTotalNegativeReviews)
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
            .GET("/total/this-month", userController::getTotalUsers)
            .GET("/months/count", userController::getUserCountForLastSixMonths)
            .POST("/create", userController::createUser)
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
            .GET("/users/count", roleController::getRolesWithUserCount)
            .build();
    }

    private RouterFunction<ServerResponse> viewRoutes(ViewController viewController) {
        return RouterFunctions
            .route()
            .GET("/course/{courseId}", viewController::findViewsByCourseId)
            .GET("/auth", viewController::findViewsByAuthUser)
            .GET("/total/this-month", viewController::getTotalViews)
            .GET("/courses/this-month/decreasing", viewController::findCoursesWithDecreasingViews)
            .POST("/create", viewController::createView)
            .build();
    }

    private RouterFunction<ServerResponse> searchHistoryRoutes(SearchHistoryController searchHistoryController) {
        return RouterFunctions
            .route()
            .GET("/auth", searchHistoryController::findByAuthUser)
            .POST("/create", searchHistoryController::createSearchHistory)
            .build();
    }

    private RouterFunction<ServerResponse> payURoutes(PaymentController paymentController) {
        return RouterFunctions
            .route()
            .POST("/confirm", paymentController::confirmPayment)
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
    ReactionController reactionController() {
        return new ReactionController();
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

    @Bean
    ViewController viewController() {
        return new ViewController();
    }

    @Bean
    SearchHistoryController searchHistoryController() {
        return new SearchHistoryController();
    }

    @Bean
    PaymentController paymentController() {
        return new PaymentController();
    }
}
