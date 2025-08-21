// src/components/TemplateSelector.jsx
import React, { useState, useEffect, useRef } from "react";

const templates = [
  { id: "minimalist", name: "Minimalist", preview: "images/minimalist.png", description: "Clean, simple, and elegant design with focus on content." },
  { id: "modern", name: "Modern", preview: "images/modern.png", description: "Bold layouts, vibrant accents, and contemporary styling." },
  { id: "classic", name: "Classic", preview: "images/classic.png", description: "Timeless layout with professional typography and structure." },
  { id: "creative", name: "Creative Portfolio", preview: "images/creative.png", description: "Eye-catching design perfect for designers and artists." },
  { id: "tech", name: "Tech Focus", preview: "images/techfocus.png", description: "Modern tech-style layout with code-inspired accents." },
  { id: "bold-colorful", name: "Neon Grid", preview: "images/neongrid.png", description: "Vibrant colors and dynamic sections to stand out." },
  { id: "luminous", name: "Luminous", preview: "images/Lumen.png", description: "Elegant, responsive, and professionally polished — a modern portfolio with warmth and impact." },
  { id: "nova", name: "Nova", preview: "images/Nova.png", description: "Smooth scrolling layout ideal for storytelling and UX." },
  { id: "vibrant", name: "Vibrant", preview: "images/Vibrant.png", description: "Sleek dark theme with light text for modern contrast." },
];

export const templateMap = {
  minimalist: React.lazy(() => import("../Templates/MinimalistPortfolio")),
  modern: React.lazy(() => import("../Templates/ModernPortfolio")),
  classic: React.lazy(() => import("../Templates/ClassicPortfolio")),
  creative: React.lazy(() => import("../Templates/CreativePortfolio")),
  tech: React.lazy(() => import("../Templates/TechFocusPortfolio")),
  "bold-colorful": React.lazy(() => import("../Templates/NeonGridPortfolio")),
  luminous: React.lazy(() => import("../Templates/LumenPortfolio")),
  nova: React.lazy(() => import("../Templates/NovaPortfolio")),
  vibrant: React.lazy(() => import("../Templates/VibrantPortfolio")),
};

const TemplateSelector = ({ formData, setFormData }) => {
  const [previewModal, setPreviewModal] = useState(null);
  const [imgError, setImgError] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const closeBtnRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setPreviewModal(null);
    };
    if (previewModal) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [previewModal]);

  // Focus close button when modal opens
  useEffect(() => {
    if (previewModal && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [previewModal]);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-gray-200">
        <span className="text-3xl text-purple-400">🎨</span>
        Select a Template
      </h2>

      <p className="text-sm text-slate-400 mb-6">
        {isMobile
          ? "Tap to select your preferred template."
          : "Hover over a template to preview. Click 'Preview' to view full image."}
      </p>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {templates.map((template) => (
          <label
            key={template.id}
            className={`group relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-purple-500 ${
              formData.template === template.id
                ? "border-purple-500/70 shadow-lg shadow-purple-500/20"
                : "border-slate-600 hover:border-slate-500"
            }`}
            aria-label={`Template: ${template.name}. ${template.description}`}
          >
            <input
              type="radio"
              name="template"
              value={template.id}
              checked={formData.template === template.id}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              className="sr-only"
              aria-label={`Select ${template.name} template`}
            />

            {/* Template Image */}
            <div className="aspect-video w-full overflow-hidden bg-slate-800 relative">
              <img
                src={template.preview}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={() =>
                  setImgError((prev) => ({ ...prev, [template.id]: true }))
                }
                onLoad={() =>
                  setImgError((prev) => ({ ...prev, [template.id]: false }))
                }
              />

              {/* Fallback UI */}
              {imgError[template.id] && (
                <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center text-slate-500 text-xs font-medium pointer-events-none">
                  Preview Unavailable
                </div>
              )}

              {/* Preview Button (desktop only) */}
              {!isMobile && !imgError[template.id] && (
                <button
                  type="button"
                  onClick={() => setPreviewModal(template)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
                >
                  <span className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-200 transition-colors">
                    🔍 Preview
                  </span>
                </button>
              )}
            </div>

            {/* Text Info */}
            <div className="p-4 bg-slate-800/50">
              <h3 className="font-semibold text-white text-center mb-1">{template.name}</h3>
              <p className="text-sm text-slate-400 text-center line-clamp-2 leading-tight">
                {template.description}
              </p>
            </div>

            {/* Checkmark for Selected */}
            {formData.template === template.id && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full p-1.5 w-7 h-7 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Fullscreen Preview Modal (Desktop Only) */}
      {!isMobile && previewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${previewModal.name} template`}
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              ref={closeBtnRef}
              onClick={() => setPreviewModal(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Close preview"
            >
              ✕
            </button>

            {/* Preview Image */}
            <img
              src={previewModal.preview}
              alt={`Preview of ${previewModal.name} template`}
              className="w-full h-auto object-contain"
              style={{ maxHeight: "calc(90vh - 2rem)" }}
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Hide image alt text visually but preserve a11y */
        img[alt] {
          color: transparent;
        }
        img[alt]::selection,
        img[alt]::moz-selection {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default TemplateSelector;