package com.api.flux.courseed.services.implementations;

import java.security.Principal;

import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Category;
import com.api.flux.courseed.persistence.documents.Content;
import com.api.flux.courseed.persistence.documents.Institution;
import com.api.flux.courseed.persistence.documents.Like;
import com.api.flux.courseed.persistence.documents.Review;
import com.api.flux.courseed.persistence.repositories.CategoryRepository;
import com.api.flux.courseed.persistence.repositories.ContentRepository;
import com.api.flux.courseed.persistence.repositories.CourseRepository;
import com.api.flux.courseed.persistence.repositories.InstitutionRepository;
import com.api.flux.courseed.persistence.repositories.LikeRepository;
import com.api.flux.courseed.persistence.repositories.ReviewRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.dtos.CreateReviewDto;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.UpdateReviewDto;
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.projections.mappers.ContentMapper;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.projections.mappers.InstitutionMapper;
import com.api.flux.courseed.projections.mappers.LikeMapper;
import com.api.flux.courseed.projections.mappers.ReviewMapper;
import com.api.flux.courseed.services.interfaces.InterfaceReviewService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ReviewService implements InterfaceReviewService {

    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private CourseRepository courseRepository;
    private CategoryRepository categoryRepository;
    private InstitutionRepository institutionRepository;
    private ContentRepository contentRepository;
    private LikeRepository likeRepository;
    private ReviewMapper reviewMapper;
    private CourseMapper courseMapper;
    private CategoryMapper categoryMapper;
    private InstitutionMapper institutionMapper;
    private LikeMapper likeMapper;
    private ContentMapper contentMapper;

    public ReviewService(
        ReviewRepository reviewRepository, UserRepository userRepository,
        CourseRepository courseRepository, CategoryRepository categoryRepository,
        InstitutionRepository institutionRepository, ContentRepository contentRepository,
        LikeRepository likeRepository, ReviewMapper reviewMapper, CourseMapper courseMapper,
        CategoryMapper categoryMapper, InstitutionMapper institutionMapper, LikeMapper likeMapper,
        ContentMapper contentMapper
    ) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.institutionRepository = institutionRepository;
        this.contentRepository = contentRepository;
        this.likeRepository = likeRepository;
        this.reviewMapper = reviewMapper;
        this.courseMapper = courseMapper;
        this.categoryMapper = categoryMapper;
        this.institutionMapper = institutionMapper;
        this.likeMapper = likeMapper;
        this.contentMapper = contentMapper;
    }

    @Override
    public Flux<ReviewDto> getReviewsByCourseId(String courseId) {
        return reviewRepository.findByCourseId(courseId)
            .flatMap(review -> userRepository.findById(review.getUserId())
                .flatMap(user -> {
                    ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                    UserDto userDto = new UserDto(user.getId(), user.getEmail());
                    reviewDto.setUser(userDto);
                    return Mono.just(reviewDto);  
                })
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    courseId, 
                    "courseId", 
                    "No se encontraron reseñas del curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Flux<ReviewDto> getReviewsByAuthUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
            .flatMapMany(user -> reviewRepository.findByUserId(user.getId())
                .flatMap(review -> courseRepository.findById(review.getCourseId())
                    .flatMap(course -> {
                        Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                        Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                        Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                        Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                        Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                        return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                            .map(tuple -> {
                                ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                                CourseDto courseDto = courseMapper.toCourseDto(course);
                                courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                                courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                                courseDto.setContents(tuple.getT3().stream()
                                    .map(contentMapper::toContentDto)
                                    .toList()
                                );
                                courseDto.setLikes(tuple.getT4().stream()
                                    .map(likeMapper::toLikeDto)
                                    .toList()
                                );
                                courseDto.setReviews(tuple.getT5().stream()
                                    .map(reviewMapper::toReviewDto)
                                    .toList()
                                );

                                reviewDto.setCourse(courseMapper.toCourseDto(course));
                                reviewDto.setUser(new UserDto(user.getId(), user.getEmail()));

                                return reviewDto;
                            });
                    })
                )
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "No se encontraron reseñas del usuario autenticado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Object> createReview(Principal principal, CreateReviewDto createReviewDto) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> courseRepository.findById(createReviewDto.getCourseId())
                .flatMap(course -> reviewRepository.findByUserIdAndCourseId(user.getId(), course.getId())
                    .flatMap(review -> Mono.error(
                        new CustomWebExchangeBindException(
                            createReviewDto.getCourseId(), 
                            "courseId", 
                            "¡Tu reseña es importante para nosotros! Sin embargo, solo se permite una reseña por usuario para cada curso."
                        ).getWebExchangeBindException()
                    ))
                    .switchIfEmpty(Mono.defer(() -> {
                        Review review = reviewMapper.toReview(createReviewDto);
                        review.setUserId(user.getId());
                        return reviewRepository.save(review)
                            .flatMap(savedReview -> {
                                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                                Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                                    .map(tuple -> {
                                        ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                                        CourseDto courseDto = courseMapper.toCourseDto(course);
                                        courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                                        courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                                        courseDto.setContents(tuple.getT3().stream()
                                            .map(contentMapper::toContentDto)
                                            .toList()
                                        );
                                        courseDto.setLikes(tuple.getT4().stream()
                                            .map(likeMapper::toLikeDto)
                                            .toList()
                                        );
                                        courseDto.setReviews(tuple.getT5().stream()
                                            .map(reviewMapper::toReviewDto)
                                            .toList()
                                        );

                                        reviewDto.setCourse(courseMapper.toCourseDto(course));
                                        reviewDto.setUser(new UserDto(user.getId(), user.getEmail()));

                                        return reviewDto;
                                    });
                            });
                    }))
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        createReviewDto.getCourseId(), 
                        "courseId", 
                        "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException())
                )
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<ReviewDto> updateReview(Principal principal, String id, UpdateReviewDto updateReviewDto) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> reviewRepository.findById(id)
                .flatMap(review -> {
                    if (review.getUserId().equals(user.getId())) {
                        review.setContent(updateReviewDto.getContent());
                        review.setRating(updateReviewDto.getRating());
                        return reviewRepository.save(review)
                            .flatMap(savedReview -> courseRepository.findById(savedReview.getCourseId())
                                .flatMap(course -> {
                                    Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                                    Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                                    Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                                    Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                                    Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());
    
                                    return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                                        .map(tuple -> {
                                            ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                                            CourseDto courseDto = courseMapper.toCourseDto(course);
                                            courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                                            courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                                            courseDto.setContents(tuple.getT3().stream()
                                                .map(contentMapper::toContentDto)
                                                .toList()
                                            );
                                            courseDto.setLikes(tuple.getT4().stream()
                                                .map(likeMapper::toLikeDto)
                                                .toList()
                                            );
                                            courseDto.setReviews(tuple.getT5().stream()
                                                .map(reviewMapper::toReviewDto)
                                                .toList()
                                            );
    
                                            reviewDto.setCourse(courseMapper.toCourseDto(course));
                                            reviewDto.setUser(new UserDto(user.getId(), user.getEmail()));
    
                                            return reviewDto;
                                        });
                                })
                            );
                    } else {
                        return Mono.error(
                            new CustomWebExchangeBindException(
                                principal.getName(), 
                                "auth", 
                                "No tiene la autorización necesaria para actualizar una reseña que corresponde a otro usuario."
                            ).getWebExchangeBindException()
                        );
                    }
                })
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        id, 
                        "reviewId", 
                        "No hemos podido encontrar la reseña indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Boolean> deleteReview(Principal principal, String id) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> reviewRepository.findById(id)
                .flatMap(review -> {
                    if (review.getUserId().equals(user.getId())) {
                        return reviewRepository.deleteById(review.getId())
                            .then(Mono.just(true));
                    } else {
                        return Mono.error(
                            new CustomWebExchangeBindException(
                                principal.getName(), 
                                "auth", 
                                "No tiene la autorización necesaria para eliminar una reseña que corresponde a otro usuario."
                            ).getWebExchangeBindException()
                        );
                    }
                })
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        id, 
                        "reviewId", 
                        "No hemos podido encontrar la reseña indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }
}
