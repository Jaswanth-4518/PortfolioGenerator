package com.portfolio.backend.dto;

import java.util.List;

import com.portfolio.backend.model.Certification;
import com.portfolio.backend.model.Education;
import com.portfolio.backend.model.Skill;
import com.portfolio.backend.model.WorkExperience;

public class UserDTO {

    // Basic Personal Details
    public String name;
    public String email;
    public String headline;
    public String location;
    public String github;
    public String linkedin;
    public String portfolio;
    public String template;
    public String phone;
    public String tagline;
    public String profilePhoto;
    public String highestQualification;
    public String experience;
    public Boolean freelanceAvailable;
    public String gender;

    // Resume field (new)
    public String resume;

    // Skill Lists
    private List<Skill> technicalSkills;
    private List<Skill> professionalSkills;

    // Experience & Certifications
    private List<WorkExperience> workExperience;
    private List<Certification> certifications;

    // Projects (using nested DTO)
    public List<ProjectDTO> projects;

    private List<Education> education;

    // ✅ Getter and Setter for technicalSkills
    public List<Skill> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<Skill> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    // ✅ Getter and Setter for professionalSkills
    public List<Skill> getProfessionalSkills() {
        return professionalSkills;
    }

    public void setProfessionalSkills(List<Skill> professionalSkills) {
        this.professionalSkills = professionalSkills;
    }

    // ✅ Getter and Setter for workExperience
    public List<WorkExperience> getWorkExperience() {
        return workExperience;
    }

    public void setWorkExperience(List<WorkExperience> workExperience) {
        this.workExperience = workExperience;
    }

    // ✅ Getter and Setter for certifications
    public List<Certification> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<Certification> certifications) {
        this.certifications = certifications;
    }

    // ✅ Getter and Setter for resume
    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    // Nested DTO class for projects
    public static class ProjectDTO {

        public String title;
        public String description;
        public String link;
    }

    // Getters and Setters
    public List<Education> getEducation() {
        return education;
    }

    public void setEducation(List<Education> education) {
        this.education = education;
    }
}
