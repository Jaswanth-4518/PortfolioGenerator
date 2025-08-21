import React from "react";

// Separate pure component for link preview
const LinkPreview = ({ url }) => {
  // Normalize URL by adding https:// if protocol is missing
  const normalizeUrl = (input) => {
    try {
      // If it already has a protocol, just return
      if (input.startsWith("http://") || input.startsWith("https://")) {
        return input;
      }
      // Otherwise, prepend https://
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
        aria-label={`Open certificate link: ${parsed.hostname}`}
      >
        🔗 {parsed.hostname}
      </a>
    );
  } catch (e) {
    return (
      <p className="text-xs text-slate-500 mt-2">
        🔗 Invalid link — please enter a valid URL (e.g., https://example.com)
      </p>
    );
  }
};

const Certifications = ({ formData, setFormData }) => {
  const handleChange = (index, field, value) => {
    const updatedCerts = [...formData.certifications];
    updatedCerts[index][field] = value;
    setFormData({ ...formData, certifications: updatedCerts });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { title: "", issuer: "", date: "", link: "" },
      ],
    });
  };

  const removeCertification = (index) => {
    const updatedCerts = formData.certifications.filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: updatedCerts });
  };

  return (
    <div
      className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100"
      aria-labelledby="certifications-heading"
    >
      {/* Header */}
      <h2
        id="certifications-heading"
        className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-200"
      >
        <span className="text-3xl text-purple-400" aria-hidden="true">
          🎓
        </span>
        Certifications
      </h2>

      {/* Certification Items */}
      {formData.certifications.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-sm">
          No certifications added yet. Click "Add Certification" to begin.
        </div>
      ) : (
        <ul className="space-y-5" aria-label="List of certifications">
          {formData.certifications.map((cert, index) => (
            <li
              key={index}
              className="bg-slate-800/40 border border-slate-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-500/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor={`cert-title-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Certification Title
                  </label>
                  <input
                    id={`cert-title-${index}`}
                    type="text"
                    placeholder="e.g., AWS Certified Developer"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={cert.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                    aria-label={`Certification title for entry ${index + 1}`}
                  />
                </div>

                {/* Issuer */}
                <div>
                  <label
                    htmlFor={`cert-issuer-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Issuer
                  </label>
                  <input
                    id={`cert-issuer-${index}`}
                    type="text"
                    placeholder="e.g., Coursera, Google"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={cert.issuer}
                    onChange={(e) =>
                      handleChange(index, "issuer", e.target.value)
                    }
                    aria-label={`Issuer for certification ${index + 1}`}
                  />
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor={`cert-date-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Date Obtained
                  </label>
                  <input
                    id={`cert-date-${index}`}
                    type="date"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none text-white text-sm transition-all"
                    value={cert.date}
                    onChange={(e) =>
                      handleChange(index, "date", e.target.value)
                    }
                    aria-label={`Date obtained for certification ${index + 1}`}
                  />
                </div>

                {/* Link */}
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor={`cert-link-${index}`}
                    className="block text-sm font-semibold text-slate-300 mb-2"
                  >
                    Certificate Link (Optional)
                  </label>
                  <input
                    id={`cert-link-${index}`}
                    type="url"
                    inputMode="url"
                    autoCapitalize="off"
                    placeholder="https://example.com/certificate"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none text-white placeholder-slate-400 text-sm transition-all"
                    value={cert.link}
                    onChange={(e) =>
                      handleChange(index, "link", e.target.value)
                    }
                    aria-label={`Certificate link for entry ${index + 1}`}
                  />

                  {/* Link Preview */}
                  {cert.link && <LinkPreview url={cert.link} />}
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeCertification(index)}
                aria-label={`Remove certification: ${cert.title || "Untitled"}`}
                className="mt-4 px-4 py-1.5 text-sm bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 hover:text-red-200 font-medium transition-all flex items-center gap-2 border border-red-700/30"
              >
                ✖ Remove Certification
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Button */}
      <button
        type="button"
        onClick={addCertification}
        aria-label="Add a new certification"
        className="mt-3 px-5 py-2.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        ➕ Add Certification
      </button>
    </div>
  );
};

export default Certifications;