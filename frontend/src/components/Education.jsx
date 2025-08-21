import React from "react";

const Education = ({ formData, setFormData }) => {
  const { education = [] } = formData;

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...education,
        {
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          grade: "",
          description: "",
          location: "",
        },
      ],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const removeEducation = (index) => {
    const filtered = education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: filtered });
  };

  // Get current date in 'YYYY-MM' format for month input max
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  return (
    <div
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100"
      aria-labelledby="education-heading"
    >
      {/* Header */}
      <h2
        id="education-heading"
        className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-200"
      >
        <span className="text-3xl text-blue-400" aria-hidden="true">
          🎓
        </span>
        Education
      </h2>

      {/* Empty State */}
      {education.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-sm bg-slate-800/40 border border-slate-600 rounded-xl">
          No education added yet. Click "Add Education" to begin.
        </div>
      ) : (
        <ul className="space-y-6" aria-label="List of education entries">
          {education.map((edu, index) => (
            <li
              key={index}
              className="bg-slate-800/40 border border-slate-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* School */}
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor={`edu-school-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    School / University
                  </label>
                  <input
                    id={`edu-school-${index}`}
                    type="text"
                    placeholder="e.g., Massachusetts Institute of Technology"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, "school", e.target.value)
                    }
                    autoCapitalize="on"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    aria-label={`School name for entry ${index + 1}`}
                  />
                </div>

                {/* Degree */}
                <div>
                  <label
                    htmlFor={`edu-degree-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Degree
                  </label>
                  <input
                    id={`edu-degree-${index}`}
                    type="text"
                    placeholder="e.g., B.Sc, M.Tech"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    autoCapitalize="on"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    aria-label={`Degree for entry ${index + 1}`}
                  />
                </div>

                {/* Field of Study */}
                <div>
                  <label
                    htmlFor={`edu-field-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Field of Study
                  </label>
                  <input
                    id={`edu-field-${index}`}
                    type="text"
                    placeholder="e.g., Data Science"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(index, "field", e.target.value)
                    }
                    autoCapitalize="on"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    aria-label={`Field of study for entry ${index + 1}`}
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor={`edu-location-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Location
                  </label>
                  <input
                    id={`edu-location-${index}`}
                    type="text"
                    placeholder="e.g., Cambridge, MA"
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(index, "location", e.target.value)
                    }
                    autoCapitalize="on"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    aria-label={`Location for entry ${index + 1}`}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label
                    htmlFor={`edu-startDate-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Start Date
                  </label>
                  <input
                    id={`edu-startDate-${index}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(index, "startDate", e.target.value)
                    }
                    max={currentMonth} // Prevent future start dates
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white text-sm transition-all"
                    aria-label={`Start date for education entry ${index + 1}`}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label
                    htmlFor={`edu-endDate-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    End Date
                  </label>
                  <input
                    id={`edu-endDate-${index}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(index, "endDate", e.target.value)
                    }
                    max={currentMonth} // Prevent future end dates
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white text-sm transition-all"
                    aria-label={`End date for education entry ${index + 1}`}
                  />
                </div>

                {/* Grade / GPA */}
                <div>
                  <label
                    htmlFor={`edu-grade-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Grade / Percentage
                  </label>
                  <input
                    id={`edu-grade-${index}`}
                    type="text"
                    placeholder="e.g., 3.7/4.0"
                    value={edu.grade}
                    onChange={(e) =>
                      updateEducation(index, "grade", e.target.value)
                    }
                    autoCapitalize="off"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    aria-label={`Grade or GPA for entry ${index + 1}`}
                  />
                </div>

              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeEducation(index)}
                aria-label={`Remove education entry for ${
                  edu.school || "Untitled School"
                }`}
                className="mt-5 px-4 py-1.5 text-sm bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 hover:text-red-200 font-medium transition-all flex items-center gap-2 border border-red-700/30"
              >
                ✖ Remove This Education
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Button */}
      <button
        type="button"
        onClick={addEducation}
        aria-label="Add a new education entry"
        className="mt-6 px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        ➕ Add Education
      </button>
    </div>
  );
};

export default Education;