package com.api.flux.courseed.services.implementations;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Category;
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
import com.api.flux.courseed.projections.dtos.LikeDto;
import com.api.flux.courseed.projections.dtos.SaveLikeDto;
import com.api.flux.courseed.projections.dtos.TotalLikesDto;
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.projections.mappers.ContentMapper;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.projections.mappers.InstitutionMapper;
import com.api.flux.courseed.projections.mappers.LikeMapper;
import com.api.flux.courseed.projections.mappers.ReviewMapper;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceLikeService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class LikeService implements InterfaceLikeService {

    private LikeRepository likeRepository;
    private CourseRepository courseRepository;
    private UserRepository userRepository;
    private CategoryRepository categoryRepository;
    private InstitutionRepository institutionRepository;
    private ReviewRepository reviewRepository;
    private LikeMapper likeMapper;
    private CourseMapper courseMapper;
    private UserMapper userMapper;
    private CategoryMapper categoryMapper;
    private InstitutionMapper institutionMapper;
    private ReviewMapper reviewMapper;

    public LikeService(LikeRepository likeRepository, CourseRepository courseRepository, UserRepository userRepository,
            CategoryRepository categoryRepository, InstitutionRepository institutionRepository,
            ContentRepository contentRepository, ReviewRepository reviewRepository, LikeMapper likeMapper,
            CourseMapper courseMapper, UserMapper userMapper, CategoryMapper categoryMapper,
            InstitutionMapper institutionMapper, ContentMapper contentMapper, ReviewMapper reviewMapper) {
        this.likeRepository = likeRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.institutionRepository = institutionRepository;
        this.reviewRepository = reviewRepository;
        this.likeMapper = likeMapper;
        this.courseMapper = courseMapper;
        this.userMapper = userMapper;
        this.categoryMapper = categoryMapper;
        this.institutionMapper = institutionMapper;
        this.reviewMapper = reviewMapper;
    }

    @Override
    public Mono<TotalLikesDto> getTotalLikes() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth()).withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        return likeRepository.count()
            .flatMap(total -> likeRepository.countByCreatedAtBetween(startOfMonth, endOfMonth)
                .map(lastMonth -> new TotalLikesDto(total, lastMonth))
            );
    }

    @Override
    public Flux<LikeDto> getLikesByCourseId(String courseId) {
        return likeRepository.findByCourseId(courseId)
            .flatMap(like -> userRepository.findById(like.getUserId())
                .flatMap(user -> courseRepository.findById(like.getCourseId())
                    .flatMap(course -> categoryRepository.findById(course.getCategoryId())
                        .flatMap(category -> institutionRepository.findById(course.getInstitutionId())
                            .flatMap(institution -> {
                                LikeDto likeDto = likeMapper.toLikeDto(like);
                                CourseDto courseDto = courseMapper.toCourseDto(course);
                                UserDto userDto = new UserDto(user.getId(), user.getEmail());

                                courseDto.setCategory(categoryMapper.toCategoryDto(category));
                                courseDto.setInstitution(institutionMapper.toInstitutionDto(institution));

                                likeDto.setCourse(courseDto);
                                likeDto.setUser(userDto);

                                return Mono.just(likeDto);
                            })
                        )
                    )
                )
            )
            .switchIfEmpty(Mono.error(new CustomWebExchangeBindException(
                courseId,
                "courseId",
                "No se encontraron 'me gusta' del curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
            ).getWebExchangeBindException()));
    }

    @Override
    public Mono<Page<LikeDto>> getLikesByAuthUser(Principal principal, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return userRepository.findByEmail(principal.getName())
            .flatMapMany(user -> likeRepository.findByUserId(user.getId(), pageable)
                .flatMap(like -> courseRepository.findById(like.getCourseId())
                    .flatMap(course -> {
                        Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                        Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                        Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());
                        Flux<Like> likeFlux = likeRepository.findByCourseId(course.getId());

                        return Mono.zip(categoryMono, institutionMono, reviewFlux.collectList(), likeFlux.collectList())
                            .map(tuple -> {
                                LikeDto likeDto = likeMapper.toLikeDto(like);
                                CourseDto courseDto = courseMapper.toCourseDto(course);
                                UserDto userDto = userMapper.toUserDto(user);

                                courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                                courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                                courseDto.setReviews(tuple.getT3().stream()
                                    .map(reviewMapper::toReviewDto)
                                    .toList()
                                );
                                courseDto.setLikes(tuple.getT4().stream()
                                    .map(likeMapper::toLikeDto)
                                    .toList()
                                );
                                likeDto.setCourse(courseDto);
                                likeDto.setUser(userDto);

                                return likeDto;
                            });
                    })
                )
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "No se encontraron 'me gusta' del usuario autenticado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ))
            .collectList()
            .zipWith(reviewRepository.count())
            .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }

    @Override
    public Mono<Object> createLike(Principal principal, SaveLikeDto saveLikeDto) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> courseRepository.findById(saveLikeDto.getCourseId())
                .flatMap(course -> likeRepository.findByUserIdAndCourseId(user.getId(), course.getId())
                    .flatMap(like -> Mono.error(
                        new CustomWebExchangeBindException(
                            saveLikeDto.getCourseId(), 
                            "courseId",
                            "¡Genial que te guste el curso! Ten en cuenta que solo se permite un 'me gusta' por usuario."
                        ).getWebExchangeBindException()
                    ))
                    .switchIfEmpty(Mono.defer(() -> {
                        Like like = new Like();
                        like.setUserId(user.getId());
                        like.setCourseId(course.getId());
                        return likeRepository.save(like)
                            .flatMap(createdLike -> {
                                LikeDto likeDto = likeMapper.toLikeDto(like);
                                likeDto.setCourse(courseMapper.toCourseDto(course));
                                likeDto.setUser(new UserDto(user.getId(), user.getEmail()));

                                return Mono.just(likeDto);
                            });
                    }))
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        saveLikeDto.getCourseId(), 
                        "courseId", 
                        "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            ).switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Boolean> deleteLike(Principal principal, String id) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> likeRepository.findById(id)
                .flatMap(like -> {
                    if (like.getUserId().equals(user.getId())) {
                        return likeRepository.deleteById(like.getId())
                            .then(Mono.just(true));
                    } else {
                        return Mono.error(
                            new CustomWebExchangeBindException(
                                principal.getName(), 
                                "auth", 
                                "No tiene la autorización necesaria para eliminar un 'me gusta' que corresponde a otro usuario."
                            ).getWebExchangeBindException()
                        );
                    }
                })
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        id, 
                        "likeId", 
                        "No hemos podido encontrar el 'me gusta' indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
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
