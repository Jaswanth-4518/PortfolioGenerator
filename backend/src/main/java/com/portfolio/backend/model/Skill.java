package com.portfolio.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Skill {

    private String name;
    private Integer level; // Use percentage like 80 for 80%

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }
}
