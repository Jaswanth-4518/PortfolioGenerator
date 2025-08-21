import React from "react";

const SocialLinks = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    // Trim and clean input
    setFormData({ ...formData, [field]: value.trim() });
  };

  // Helper to extract clean domain or return null if invalid
  const getDisplayUrl = (url) => {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch (e) {
      return null; // Return null for invalid URLs
    }
  };

  // Helper to get icon based on domain
  const getIcon = (url) => {
    if (!url) return "🔗";
    try {
      const host = new URL(url).hostname;
      if (host.includes("linkedin.com")) return "💼";
      if (host.includes("github.com")) return "🐙";
      if (host.includes("twitter.com") || host.includes("x.com")) return "𝕏";
      if (host.includes("portfolio") || host.includes("vercel") || host.includes("netlify"))
        return "🖼️";
      return "🌐";
    } catch (e) {
      return "🔗";
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-200">
        <span className="text-3xl text-cyan-400">🔗</span>
        Social Links
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-400 mb-6">
        Add your public profiles so employers can learn more about you.
      </p>

      <div className="space-y-5">
        {/* GitHub */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            GitHub Profile Link
          </label>
          <input
            type="url"
            inputMode="url"
            autoCapitalize="off"
            placeholder="https://github.com/yourusername"
            aria-label="GitHub profile URL"
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
            value={formData.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
          />
          {getDisplayUrl(formData.github) ? (
            <a
              href={formData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-flex items-center gap-1 transition-colors"
            >
              {getIcon(formData.github)} {getDisplayUrl(formData.github)}
            </a>
          ) : formData.github ? (
            <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
              ⚠ Invalid GitHub URL — please enter a valid link (e.g., https://github.com/john)
            </p>
          ) : null}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            LinkedIn Profile Link
          </label>
          <input
            type="url"
            inputMode="url"
            autoCapitalize="off"
            placeholder="https://www.linkedin.com/in/yourname"
            aria-label="LinkedIn profile URL"
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
            value={formData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
          {getDisplayUrl(formData.linkedin) ? (
            <a
              href={formData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-flex items-center gap-1 transition-colors"
            >
              {getIcon(formData.linkedin)} {getDisplayUrl(formData.linkedin)}
            </a>
          ) : formData.linkedin ? (
            <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
              ⚠ Invalid LinkedIn URL — use your full public profile URL (e.g., https://linkedin.com/in/yourname)
            </p>
          ) : null}
          <p className="text-xs text-slate-500 mt-1">
            Tip: Your public URL is in your LinkedIn profile settings — not your feed link.
          </p>
        </div>

        {/* Portfolio / Website */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Blog or Website
          </label>
          <input
            type="url"
            inputMode="url"
            autoCapitalize="off"
            placeholder="https://yoursite.com"
            aria-label="Personal website or blog URL"
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
            value={formData.portfolio || ""}
            onChange={(e) => handleChange("portfolio", e.target.value)}
          />
          {getDisplayUrl(formData.portfolio) ? (
            <a
              href={formData.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-flex items-center gap-1 transition-colors"
            >
              {getIcon(formData.portfolio)} {getDisplayUrl(formData.portfolio)}
            </a>
          ) : formData.portfolio ? (
            <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
              ⚠ Invalid website URL — please enter a valid link (e.g., https://example.com)
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;