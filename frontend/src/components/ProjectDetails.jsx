import React from "react";

// Reusable component for link preview
const LinkPreview = ({ url }) => {
  // Handle missing or empty URL
  if (!url || typeof url !== "string") {
    return null;
  }

  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname;

    // Avoid misleading preview for placeholder-like domains
    const isPlaceholder =
      hostname === "example.com" ||
      hostname.includes("yourproject") ||
      hostname.includes("github.com/yourproject");

    return (
      <a
        href={parsed.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-flex items-center gap-1 transition-colors break-all"
        aria-label={`Visit project website: ${hostname}`}
      >
        🌐 {isPlaceholder ? <em className="text-slate-400">Preview available after save</em> : hostname}
      </a>
    );
  } catch (e) {
    return (
      <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
        ⚠ Invalid URL — please enter a valid link (e.g., https://example.com)
      </p>
    );
  }
};

const ProjectDetails = ({ formData, setFormData }) => {
  const handleChange = (index, field, value) => {
    const updatedProjects = [...(formData.projects || [])];
    updatedProjects[index][field] = value;
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addProject = () => {
    const newItem = {
      title: "",
      description: "",
      link: "", // Default to empty; avoid placeholder URLs that may confuse parser
    };
    setFormData({
      ...formData,
      projects: [...(formData.projects || []), newItem],
    });
  };

  const removeProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-200">
        <span className="text-3xl text-cyan-400">🛠️</span>
        Projects
      </h2>

      {/* Projects List */}
      {formData.projects?.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-sm bg-slate-800/40 border border-slate-600 rounded-xl">
          No projects added yet. Click "Add Project" to showcase your work.
        </div>
      ) : (
        <div className="space-y-6">
          {formData.projects.map((project, index) => (
            <div
              key={index}
              className="bg-slate-800/40 border border-slate-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-cyan-500/50"
            >
              {/* Project Title */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Project Title <span className="text-slate-500 text-xs">(required)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Portfolio Website"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                  value={project.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  aria-label={`Project ${index + 1}: Title`}
                />
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description <span className="text-slate-500 text-xs">(required)</span>
                </label>
                <textarea
                  placeholder="Brief overview, technologies used, your role, impact..."
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-400 text-sm resize-none"
                  rows={3}
                  value={project.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  aria-label={`Project ${index + 1}: Description`}
                />
              </div>

              {/* Project Link */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Project Link <span className="text-slate-500 text-xs">(optional)</span>
                </label>
                <input
                  type="url"
                  inputMode="url"
                  autoCapitalize="off"
                  placeholder="https://example.com"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                  value={project.link}
                  onChange={(e) => handleChange(index, "link", e.target.value.trim())}
                  aria-label={`Project ${index + 1}: URL`}
                />

                {/* Link Preview */}
                {project.link && <LinkPreview url={project.link} />}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeProject(index)}
                aria-label={`Remove project: ${project.title || 'Untitled Project'}`}
                className="px-4 py-1.5 text-sm bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 hover:text-red-200 font-medium transition-all flex items-center gap-2 border border-red-700/30"
              >
                ✖ Remove This Project
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Button */}
      <button
        type="button"
        onClick={addProject}
        aria-label="Add a new project"
        className="mt-6 px-5 py-2.5 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        ➕ Add Project
      </button>
    </div>
  );
};

export default ProjectDetails;