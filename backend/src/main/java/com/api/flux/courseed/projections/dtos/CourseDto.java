package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;
import java.util.List;

public class CourseDto implements Serializable {
    private String id;
    private String url;
    private String title;
    private String image;
    private String description;
    private String prerequisites;
    private Double price;
    private String duration;
    private String modality;
    private CategoryDto category;
    private InstitutionDto institution;
    private List<ContentDto> contents;
    private List<LikeDto> likes;
    private List<ReviewDto> reviews;
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getPrerequisites() {
        return prerequisites;
    }
    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public String getDuration() {
        return duration;
    }
    public void setDuration(String duration) {
        this.duration = duration;
    }
    public String getModality() {
        return modality;
    }
    public void setModality(String modality) {
        this.modality = modality;
    }
    public CategoryDto getCategory() {
        return category;
    }
    public void setCategory(CategoryDto category) {
        this.category = category;
    }
    public InstitutionDto getInstitution() {
        return institution;
    }
    public void setInstitution(InstitutionDto institution) {
        this.institution = institution;
    }
    public List<ContentDto> getContents() {
        return contents;
    }
    public void setContents(List<ContentDto> contents) {
        this.contents = contents;
    }
    public List<LikeDto> getLikes() {
        return likes;
    }
    public void setLikes(List<LikeDto> likes) {
        this.likes = likes;
    }
    public List<ReviewDto> getReviews() {
        return reviews;
    }
    public void setReviews(List<ReviewDto> reviews) {
        this.reviews = reviews;
    }
}
