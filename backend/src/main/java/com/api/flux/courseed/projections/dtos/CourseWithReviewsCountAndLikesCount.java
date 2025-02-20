package com.api.flux.courseed.projections.dtos;

public class CourseWithReviewsCountAndLikesCount {
    private String id;
    private String title;
    private Long totalReviews;
    private Long totalLikes;

    public CourseWithReviewsCountAndLikesCount(String id, String title, Long totalReviews, Long totalLikes) {
        this.id = id;
        this.title = title;
        this.totalReviews = totalReviews;
        this.totalLikes = totalLikes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Long getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(Long totalLikes) {
        this.totalLikes = totalLikes;
    }  
}
