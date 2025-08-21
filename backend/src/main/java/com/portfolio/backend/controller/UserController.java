package com.portfolio.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.backend.dto.UserDTO;
import com.portfolio.backend.model.Education;  // ✅ Already imported
import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<User> saveUser(@RequestBody UserDTO dto) {
        try {
            User user = new User();
            user.setName(dto.name);
            user.setEmail(dto.email);
            user.setHeadline(dto.headline);
            user.setLocation(dto.location);
            user.setGithub(dto.github);
            user.setLinkedin(dto.linkedin);
            user.setPortfolio(dto.portfolio);
            user.setTemplate(dto.template);
            user.setPhone(dto.phone);
            user.setTagline(dto.tagline);
            user.setProfilePhoto(dto.profilePhoto);
            user.setHighestQualification(dto.highestQualification);
            user.setExperience(dto.experience);
            user.setFreelanceAvailable(dto.freelanceAvailable);
            user.setGender(dto.gender);
            user.setResume(dto.getResume()); // ✅ Set resume

            // ✅ Map technical skills
            user.setTechnicalSkills(dto.getTechnicalSkills());
            user.setProfessionalSkills(dto.getProfessionalSkills());

            // ✅ Map work experience
            user.setWorkExperience(dto.getWorkExperience());

            // ✅ Map certifications
            user.setCertifications(dto.getCertifications());

            // ✅ Map education (now including location)
            List<Education> educationList = new ArrayList<>();
            if (dto.getEducation() != null) {
                for (Education edu : dto.getEducation()) {
                    Education education = new Education();
                    education.setSchool(edu.getSchool());
                    education.setDegree(edu.getDegree());
                    education.setField(edu.getField());
                    education.setStartDate(edu.getStartDate());
                    education.setEndDate(edu.getEndDate());
                    education.setGrade(edu.getGrade());
                    education.setLocation(edu.getLocation()); // ✅ Set location
                    educationList.add(education);
                }
            }
            user.setEducation(educationList);

            // ✅ Map projects
            List<Project> projects = new ArrayList<>();
            if (dto.projects != null) {
                for (UserDTO.ProjectDTO p : dto.projects) {
                    Project project = new Project();
                    project.setTitle(p.title);
                    project.setDescription(p.description);
                    project.setLink(p.link);
                    project.setUser(user);
                    projects.add(project);
                }
            }
            user.setProjects(projects);

            // ✅ Save user to database
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            System.out.println("❌ Error saving user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}