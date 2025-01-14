package com.api.flux.courseed.services.implementations;

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
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.projections.mappers.ContentMapper;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.projections.mappers.InstitutionMapper;
import com.api.flux.courseed.projections.mappers.LikeMapper;
import com.api.flux.courseed.projections.mappers.ReviewMapper;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceLikeService;

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
    public Flux<LikeDto> getLikesByCourseId(String courseId) {
        return likeRepository.findByCourseId(courseId)
            .map(likeMapper::toLikeDto);
    }

    @Override
    public Flux<LikeDto> getLikesByUserId(String userId) {
        return likeRepository.findByUserId(userId)
            .flatMap(like -> userRepository.findById(like.getUserId())
                .flatMap(user -> courseRepository.findById(like.getCourseId())
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
            ).onErrorReturn(new LikeDto());
    }

    @Override
    public Mono<LikeDto> getLikeById(String id) {
        return likeRepository.findById(id)
            .flatMap(like -> userRepository.findById(like.getUserId())
                .flatMap(user -> courseRepository.findById(like.getCourseId())
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
            ).onErrorReturn(new LikeDto());
    }

    @Override
    public Mono<LikeDto> createLike(SaveLikeDto savelikeDto) {
        return likeRepository.save(likeMapper.toLike(savelikeDto))
            .map(likeMapper::toLikeDto);
    }

    @Override
    public Mono<LikeDto> updateLike(String id, SaveLikeDto saveLikeDto) {
        return likeRepository.findById(id)
            .flatMap(likeToUpdate -> {
                likeToUpdate.setCourseId(saveLikeDto.getCourseId());
                likeToUpdate.setUserId(saveLikeDto.getUserId());
                return likeRepository.save(likeToUpdate);
            })
            .map(likeMapper::toLikeDto)
            .onErrorReturn(new LikeDto());
    }

    @Override
    public Mono<Void> deleteLike(String id) {
        return likeRepository.deleteById(id);
    }
    
}
