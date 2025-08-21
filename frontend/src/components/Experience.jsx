import React from "react";

// Separate pure component for website preview
const WebsitePreview = ({ url }) => {
  // Normalize URL by prepending https:// if protocol is missing
  const normalizeUrl = (input) => {
    try {
      if (input.startsWith("http://") || input.startsWith("https://")) {
        return input;
      }
      return `https://${input}`;
    } catch {
      return input;
    }
  };

  try {
    const normalizedUrl = normalizeUrl(url.trim());
    const parsed = new URL(normalizedUrl);
    return (
      <a
        href={normalizedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-flex items-center gap-1 transition-colors"
        aria-label={`Visit company website: ${parsed.hostname}`}
      >
        🌐 {parsed.hostname}
      </a>
    );
  } catch (e) {
    return (
      <p className="text-xs text-slate-500 mt-2">
        🌐 Invalid URL — please enter a valid web address (e.g., https://abc.com)
      </p>
    );
  }
};

const Experience = ({ formData, setFormData }) => {
  const workExperience = formData.workExperience || [];

  const handleChange = (index, field, value) => {
    const updated = [...workExperience];
    updated[index][field] = value;
    setFormData({ ...formData, workExperience: updated });
  };

  const addExperience = () => {
    const newItem = {
      role: "",
      company: "",
      duration: "",
      description: "",
      companyWebsite: "",
    };
    setFormData({
      ...formData,
      workExperience: [...workExperience, newItem],
    });
  };

  const removeExperience = (index) => {
    const updated = workExperience.filter((_, i) => i !== index);
    setFormData({ ...formData, workExperience: updated });
  };

  return (
    <div
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100"
      aria-labelledby="experience-heading"
    >
      {/* Header */}
      <h2
        id="experience-heading"
        className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-200"
      >
        <span className="text-3xl text-blue-400" aria-hidden="true">
          💼
        </span>
        Work Experience
      </h2>

      {/* Experience Items */}
      {workExperience.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-sm bg-slate-800/40 border border-slate-600 rounded-xl">
          No work experience added yet. Click "Add Experience" to begin.
        </div>
      ) : (
        <ul className="space-y-6" aria-label="List of work experiences">
          {workExperience.map((item, index) => (
            <li
              key={index}
              className="bg-slate-800/40 border border-slate-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Role */}
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor={`role-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Role
                  </label>
                  <input
                    id={`role-${index}`}
                    type="text"
                    placeholder="e.g., Frontend Developer"
                    autoCapitalize="words"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={item.role}
                    onChange={(e) => handleChange(index, "role", e.target.value)}
                    aria-label={`Job role for entry ${index + 1}`}
                  />
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor={`company-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Company
                  </label>
                  <input
                    id={`company-${index}`}
                    type="text"
                    placeholder="e.g., ABC Corp"
                    autoCapitalize="words"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={item.company}
                    onChange={(e) =>
                      handleChange(index, "company", e.target.value)
                    }
                    aria-label={`Company name for entry ${index + 1}`}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label
                    htmlFor={`duration-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Duration
                  </label>
                  <input
                    id={`duration-${index}`}
                    type="text"
                    placeholder="e.g., Jan 2022 – Dec 2023"
                    autoCapitalize="off"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={item.duration}
                    onChange={(e) =>
                      handleChange(index, "duration", e.target.value)
                    }
                    aria-label={`Employment duration for entry ${index + 1}`}
                  />
                </div>

                {/* Company Website */}
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor={`website-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Company Website
                  </label>
                  <input
                    id={`website-${index}`}
                    type="url"
                    inputMode="url"
                    autoCapitalize="off"
                    placeholder="https://abc.com"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={item.companyWebsite}
                    onChange={(e) =>
                      handleChange(index, "companyWebsite", e.target.value)
                    }
                    aria-label={`Company website URL for entry ${index + 1}`}
                  />

                  {/* Website Preview */}
                  {item.companyWebsite && (
                    <WebsitePreview url={item.companyWebsite} />
                  )}
                </div>

                {/* Description */}
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor={`description-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id={`description-${index}`}
                    placeholder="What you did, key achievements, technologies used..."
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none text-white placeholder-slate-400 text-sm resize-none"
                    rows={3}
                    value={item.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    aria-label={`Job description for entry ${index + 1}`}
                  />
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeExperience(index)}
                aria-label={`Remove experience at ${
                  item.company || "Unknown Company"
                }`}
                className="mt-5 px-4 py-1.5 text-sm bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 hover:text-red-200 font-medium transition-all flex items-center gap-2 border border-red-700/30"
              >
                ✖ Remove This Experience
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Button */}
      <button
        type="button"
        onClick={addExperience}
        aria-label="Add a new work experience entry"
        className="mt-6 px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        ➕ Add Experience
      </button>
    </div>
  );
};

export default Experience;