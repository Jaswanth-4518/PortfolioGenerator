import React from "react";

const Skills = ({ formData, setFormData }) => {
  const handleSkillChange = (type, index, field, value) => {
    const updatedSkills = [...formData[type]];

    if (field === "level") {
      // Allow empty input during typing
      if (value === "" || value === null) {
        updatedSkills[index][field] = "";
      } else {
        const numValue = parseInt(value, 10);
        // Clamp between 0 and 100
        const clampedValue = Math.max(0, Math.min(100, isNaN(numValue) ? 0 : numValue));
        updatedSkills[index][field] = clampedValue.toString();
      }
    } else {
      // Trim and set name
      updatedSkills[index][field] = value.trimStart();
    }

    setFormData({ ...formData, [type]: updatedSkills });
  };

  const addSkill = (type) => {
    const updatedSkills = [...formData[type], { name: "", level: "" }];
    setFormData({ ...formData, [type]: updatedSkills });
  };

  const removeSkill = (type, index) => {
    const updatedSkills = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updatedSkills });
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-200">
        <span className="text-3xl text-purple-400">🛠️</span>
        Skills
      </h2>

      {/* Technical Skills */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
          🔧 Technical Skills
        </h3>

        {formData.technicalSkills.length === 0 ? (
          <div className="text-center py-4 text-slate-400 text-sm bg-slate-800/40 border border-slate-600 rounded-lg">
            No technical skills added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {formData.technicalSkills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center gap-3 p-4 border border-slate-600 rounded-lg bg-slate-800/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-500/50"
              >
                {/* Skill Name */}
                <div className="flex-1 min-w-48">
                  <label className="sr-only" htmlFor={`tech-skill-name-${index}`}>
                    Skill Name
                  </label>
                  <input
                    id={`tech-skill-name-${index}`}
                    type="text"
                    autoCapitalize="words"
                    placeholder="e.g., JavaScript, React, Node.js"
                    maxLength="50"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange("technicalSkills", index, "name", e.target.value)
                    }
                    aria-label={`Technical skill name ${index + 1}`}
                  />
                </div>

                {/* Level */}
                <div className="flex-1 min-w-36">
                  <label className="sr-only" htmlFor={`tech-skill-level-${index}`}>
                    Proficiency Level
                  </label>
                  <input
                    id={`tech-skill-level-${index}`}
                    type="number"
                    inputMode="numeric"
                    placeholder="Level (%)"
                    min="0"
                    max="100"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={skill.level ?? ""}
                    onChange={(e) =>
                      handleSkillChange("technicalSkills", index, "level", e.target.value)
                    }
                    aria-label={`Proficiency level out of 100 for technical skill ${index + 1}`}
                  />
                  {/* Optional: Helper text */}
                  {skill.level !== "" && (parseInt(skill.level) < 0 || parseInt(skill.level) > 100) && (
                    <p className="text-xs text-amber-500 mt-1">Must be between 0–100</p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeSkill("technicalSkills", index)}
                  aria-label={`Remove technical skill: ${skill.name || 'Unnamed Skill'}`}
                  className="px-3 py-2 text-sm bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 hover:text-red-200 font-medium transition-all border border-red-700/30 whitespace-nowrap"
                >
                  ✖ Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => addSkill("technicalSkills")}
          aria-label="Add a new technical skill"
          className="mt-4 px-5 py-2.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          ➕ Add Technical Skill
        </button>
      </div>

      {/* Professional Skills */}
      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
          🌐 Professional Skills
        </h3>

        {formData.professionalSkills.length === 0 ? (
          <div className="text-center py-4 text-slate-400 text-sm bg-slate-800/40 border border-slate-600 rounded-lg">
            No professional skills added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {formData.professionalSkills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center gap-3 p-4 border border-slate-600 rounded-lg bg-slate-800/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500/50"
              >
                {/* Skill Name */}
                <div className="flex-1 min-w-48">
                  <label className="sr-only" htmlFor={`prof-skill-name-${index}`}>
                    Skill Name
                  </label>
                  <input
                    id={`prof-skill-name-${index}`}
                    type="text"
                    autoCapitalize="words"
                    placeholder="e.g., Communication, Leadership, Time Management"
                    maxLength="50"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange("professionalSkills", index, "name", e.target.value)
                    }
                    aria-label={`Professional skill name ${index + 1}`}
                  />
                </div>

                {/* Level */}
                <div className="flex-1 min-w-36">
                  <label className="sr-only" htmlFor={`prof-skill-level-${index}`}>
                    Proficiency Level
                  </label>
                  <input
                    id={`prof-skill-level-${index}`}
                    type="number"
                    inputMode="numeric"
                    placeholder="Level (%)"
                    min="0"
                    max="100"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={skill.level ?? ""}
                    onChange={(e) =>
                      handleSkillChange("professionalSkills", index, "level", e.target.value)
                    }
                    aria-label={`Proficiency level out of 100 for professional skill ${index + 1}`}
                  />
                  {skill.level !== "" && (parseInt(skill.level) < 0 || parseInt(skill.level) > 100) && (
                    <p className="text-xs text-amber-500 mt-1">Must be between 0–100</p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeSkill("professionalSkills", index)}
                  aria-label={`Remove professional skill: ${skill.name || 'Unnamed Skill'}`}
                  className="px-3 py-2 text-sm bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 hover:text-red-200 font-medium transition-all border border-red-700/30 whitespace-nowrap"
                >
                  ✖ Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => addSkill("professionalSkills")}
          aria-label="Add a new professional skill"
          className="mt-4 px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          ➕ Add Professional Skill
        </button>
      </div>
    </div>
  );
};

export default Skills;