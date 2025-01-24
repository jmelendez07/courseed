package com.api.flux.courseed.services.implementations;

import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Category;
import com.api.flux.courseed.persistence.documents.Content;
import com.api.flux.courseed.persistence.documents.Course;
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
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.SaveCourseDto;
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.projections.mappers.ContentMapper;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.projections.mappers.InstitutionMapper;
import com.api.flux.courseed.projections.mappers.LikeMapper;
import com.api.flux.courseed.projections.mappers.ReviewMapper;
import com.api.flux.courseed.services.interfaces.InterfaceCourseService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CourseService implements InterfaceCourseService {

    private CourseRepository courseRepository;
    private CategoryRepository categoryRepository;
    private InstitutionRepository institutionRepository;
    private ContentRepository contentRepository;
    private LikeRepository likeRepository;
    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private CourseMapper courseMapper;
    private CategoryMapper categoryMapper;
    private InstitutionMapper institutionMapper;
    private ContentMapper contentMapper;
    private LikeMapper likeMapper;
    private ReviewMapper reviewMapper;

    public CourseService(
        CourseRepository courseRepository, CategoryRepository categoryRepository,
        InstitutionRepository institutionRepository, ContentRepository contentRepository, LikeRepository likeRepository,
        ReviewRepository reviewRepository, UserRepository userRepository, CourseMapper courseMapper, CategoryMapper categoryMapper,
        InstitutionMapper institutionMapper, ContentMapper contentMapper, LikeMapper likeMapper,
        ReviewMapper reviewMapper
    ) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.institutionRepository = institutionRepository;
        this.contentRepository = contentRepository;
        this.likeRepository = likeRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
        this.categoryMapper = categoryMapper;
        this.institutionMapper = institutionMapper;
        this.contentMapper = contentMapper;
        this.likeMapper = likeMapper;
        this.reviewMapper = reviewMapper;
    }

    @Override
    public Flux<CourseDto> getAllCourses() {
        return courseRepository.findAll()
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
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

                        return courseDto;
                    });
            });
    }

    @Override
    public Mono<CourseDto> getCourseById(String id) {
        return courseRepository.findById(id)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                Flux<ReviewDto> reviewFlux = reviewRepository.findByCourseId(course.getId())
                    .flatMap(review -> userRepository.findById(review.getUserId())
                        .flatMap(user -> {
                            ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                            reviewDto.setUser(new UserDto(user.getId(), user.getEmail()));
                            return Mono.just(reviewDto);
                        })
                    );

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
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
                            .toList()
                        );

                        return courseDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "courseId", 
                    "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            ); 
    }

    @Override
    public Flux<CourseDto> getCoursesByCategoryId(String categoryId) {
        return courseRepository.findByCategoryId(categoryId)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
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

                        return courseDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    categoryId, 
                    "categoryId", 
                    "No se encontraron cursos de la categoria indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }

    @Override
    public Flux<CourseDto> getCoursesByInstitutionId(String institutionId) {
        return courseRepository.findByInstitutionId(institutionId)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
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

                        return courseDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    institutionId, 
                    "institutionId", 
                    "No se encontraron cursos de la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }
    
    @Override
    public Flux<CourseDto> searchCoursesByText(String text) {
        return courseRepository.searchCourses(text)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), likeFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
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

                        return courseDto;
                    });
            });
    }

    @Override
    public Mono<CourseDto> createCourse(SaveCourseDto saveCourseDto) {
        return categoryRepository.findById(saveCourseDto.getCategoryId())
            .flatMap(category -> institutionRepository.findById(saveCourseDto.getInstitutionId())
                .flatMap(institution -> courseRepository.save(courseMapper.toCourse(saveCourseDto))
                    .flatMap(course -> this.getCourseById(course.getId()))
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        saveCourseDto.getInstitutionId(), 
                        "institutionId", 
                        "No hemos podido encontrar la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    saveCourseDto.getCategoryId(), 
                    "categoryId", 
                    "No hemos podido encontrar la categoría indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<CourseDto> updateCourse(String id, SaveCourseDto saveCourseDto) {
        return courseRepository.findById(id)
            .flatMap(course -> categoryRepository.findById(saveCourseDto.getCategoryId())
                .flatMap(category -> institutionRepository.findById(saveCourseDto.getInstitutionId())
                    .flatMap(institution -> {
                        Course courseToUpdate = courseMapper.toCourse(saveCourseDto);
                        courseToUpdate.setId(course.getId());

                        return courseRepository.save(courseToUpdate)
                            .flatMap(updatedCourse -> this.getCourseById(updatedCourse.getId()));
                    })
                    .switchIfEmpty(Mono.error(
                        new CustomWebExchangeBindException(
                            saveCourseDto.getInstitutionId(), 
                            "institutionId", 
                            "No hemos podido encontrar la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                        ).getWebExchangeBindException()
                    ))    
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        saveCourseDto.getCategoryId(), 
                        "categoryId", 
                        "No hemos podido encontrar la categoría indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "courseId", 
                    "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }

    @Override
    public Mono<Boolean> deleteCourse(String id) {
        return courseRepository.findById(id)
            .flatMap(course -> 
                courseRepository.deleteById(id)
                    .then(Mono.just(true))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "courseId", 
                    "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }
    
}
