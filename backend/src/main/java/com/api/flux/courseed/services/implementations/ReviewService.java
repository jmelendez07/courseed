package com.api.flux.courseed.services.implementations;

import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Course;
import com.api.flux.courseed.persistence.documents.User;
import com.api.flux.courseed.persistence.repositories.CourseRepository;
import com.api.flux.courseed.persistence.repositories.ReviewRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.SaveReviewDto;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.projections.mappers.ReviewMapper;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceReviewService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ReviewService implements InterfaceReviewService {

    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private CourseRepository courseRepository;
    private ReviewMapper reviewMapper;
    private UserMapper userMapper;
    private CourseMapper courseMapper;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
        CourseRepository courseRepository, ReviewMapper reviewMapper, UserMapper userMapper,
        CourseMapper courseMapper) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.reviewMapper = reviewMapper;
        this.userMapper = userMapper;
        this.courseMapper = courseMapper;
    }

    @Override
    public Flux<ReviewDto> getReviewsByCourseId(String courseId) {
        return reviewRepository.findByCourseId(courseId)
            .flatMap(review -> {
                Mono<User> userMono = userRepository.findById(review.getUserId());
                Mono<Course> courseMono = courseRepository.findById(review.getCourseId());

                return Mono.zip(userMono, courseMono).map(tuple -> {
                    ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                    reviewDto.setUser(userMapper.toUserDto(tuple.getT1()));
                    reviewDto.setCourse(courseMapper.toCourseDto(tuple.getT2()));
                    return reviewDto;
                });
            })
            .onErrorReturn(new ReviewDto());
    }

    @Override
    public Flux<ReviewDto> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId)
            .flatMap(review -> {
                Mono<User> userMono = userRepository.findById(review.getUserId());
                Mono<Course> courseMono = courseRepository.findById(review.getCourseId());

                return Mono.zip(userMono, courseMono).map(tuple -> {
                    ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                    reviewDto.setUser(userMapper.toUserDto(tuple.getT1()));
                    reviewDto.setCourse(courseMapper.toCourseDto(tuple.getT2()));
                    return reviewDto;
                });
            })
            .onErrorReturn(new ReviewDto());
    }

    @Override
    public Mono<ReviewDto> getReviewById(String id) {
        return reviewRepository.findById(id)
            .flatMap(review -> {
                Mono<User> userMono = userRepository.findById(review.getUserId());
                Mono<Course> courseMono = courseRepository.findById(review.getCourseId());

                return Mono.zip(userMono, courseMono).map(tuple -> {
                    ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                    reviewDto.setUser(userMapper.toUserDto(tuple.getT1()));
                    reviewDto.setCourse(courseMapper.toCourseDto(tuple.getT2()));
                    return reviewDto;
                });
            })
            .onErrorReturn(new ReviewDto());
    }

    @Override
    public Mono<ReviewDto> createReview(SaveReviewDto SaveReviewDto) {
        return reviewRepository.save(reviewMapper.toReview(SaveReviewDto))
            .map(reviewMapper::toReviewDto)
            .onErrorReturn(new ReviewDto());
    }

    @Override
    public Mono<ReviewDto> updateReview(String id, SaveReviewDto saveReviewDto) {
        return reviewRepository.findById(id)
            .flatMap(r -> {
                r.setCourseId(saveReviewDto.getCourseId());
                r.setUserId(saveReviewDto.getUserId());
                r.setRating(saveReviewDto.getRating());
                r.setContent(saveReviewDto.getContent());
                return reviewRepository.save(r);
            })
            .map(reviewMapper::toReviewDto)
            .onErrorReturn(new ReviewDto()); 
    }

    @Override
    public Mono<Void> deleteReview(String id) {
        return reviewRepository.deleteById(id);
    }
}
