package com.portfolio.backend.model;

import jakarta.persistence.Embeddable;

/**
 * Embeddable entity representing an educational background entry.
 * Used within the User/Profile entity to store education history.
 */
@Embeddable
public class Education {

    private String school;
    private String degree;
    private String field;
    private String startDate;
    private String endDate;
    private String grade;
    private String location;  // New field added

    public Education() {}

    // Getters and Setters

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}