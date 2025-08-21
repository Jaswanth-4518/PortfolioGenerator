// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import PersonalDetails from "../components/PersonalDetails";
import ProjectDetails from "../components/ProjectDetails";
import SocialLinks from "../components/SocialLinks";
import TemplateSelector from "../components/TemplateSelector";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Certifications from "../components/Certifications";
import Education from "../components/Education";
import axios from "axios";

const Home = () => {
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    tagline: "",
    profilePhoto: "",
    location: "",
    highestQualification: "",
    experience: "",
    technicalSkills: [],
    professionalSkills: [],
    workExperience: [],
    freelanceAvailable: null,
    github: "",
    linkedin: "",
    portfolio: "",
    template: "",
    projects: [],
    certifications: [],
    education: [],
    gender: "",
    resume: "",
    headline: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Load saved form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioFormData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
        setHasSavedData(true);
      } catch {
        localStorage.removeItem("portfolioFormData");
      }
    }
  }, []);

  // ✅ Save form data to localStorage (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("portfolioFormData", JSON.stringify(formData));
      setHasSavedData(true);
    }, 400);
    return () => clearTimeout(timeout);
  }, [formData]);

  // ✅ Reset form and localStorage
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      setFormData(initialFormData);
      localStorage.removeItem("portfolioFormData");
      setHasSavedData(false);
    }
  };

  // Detect mobile
  useEffect(() => {
    document.title = "Craft your Portfolio";
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {
      name: !formData.name,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      headline: !formData.headline,
      location: !formData.location,
      phone: !formData.phone,
      tagline: !formData.tagline,
      gender: !formData.gender,
      highestQualification: !formData.highestQualification,
      experience: !formData.experience,
      template: !formData.template,
    };

    const firstErrorField = Object.keys(errors).find((field) => errors[field]);
    if (firstErrorField) {
      // Map field to section index
      const fieldToSectionIndex = {
        name: 0,
        headline: 0,
        location: 0,
        phone: 0,
        tagline: 0,
        gender: 0,
        highestQualification: 1,
        experience: 2,
        technicalSkills: 2,
        professionalSkills: 2,
        workExperience: 3,
        projects: 4,
        certifications: 5,
        github: 6,
        linkedin: 6,
        portfolio: 6,
        template: 7,
      };
      const sectionIndex = fieldToSectionIndex[firstErrorField];
      if (sectionIndex !== undefined) {
        const element = document.getElementById(`section-${sectionIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          setActiveSection(sectionIndex);
        }
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/users",
        formData
      );
      const id = response.data.id || response.data._id;
      if (!id) throw new Error("No ID returned");

      // Open portfolio in a new tab
      window.open(`/portfolio/${id}`, "_blank");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while generating your portfolio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "projects", label: "Projects", icon: "🛠️" },
    { id: "certifications", label: "Certifications", icon: "🏆" },
    { id: "social", label: "Social Links", icon: "🔗" },
    { id: "template", label: "Template", icon: "🎨" },
  ];

  // Map section IDs to components
  const sectionComponents = {
    personal: <PersonalDetails formData={formData} setFormData={setFormData} />,
    education: <Education formData={formData} setFormData={setFormData} />,
    skills: <Skills formData={formData} setFormData={setFormData} />,
    experience: <Experience formData={formData} setFormData={setFormData} />,
    projects: <ProjectDetails formData={formData} setFormData={setFormData} />,
    certifications: (
      <Certifications formData={formData} setFormData={setFormData} />
    ),
    social: <SocialLinks formData={formData} setFormData={setFormData} />,
    template: (
      <TemplateSelector formData={formData} setFormData={setFormData} />
    ),
  };

  // Scroll to section
  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(index);
    }
  };

  // Perfect Active Section Tracking
  useEffect(() => {
    let ticking = false;
    const sectionElements = sections.map((_, i) =>
      document.getElementById(`section-${i}`)
    );

    const updateActiveSection = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY + 100;
      const bottomOffset = scrollY + windowHeight - 200;

      let maxVisibleHeight = 0;
      let bestIndex = 0;

      sectionElements.forEach((el, index) => {
        if (!el) return;

        const top = el.offsetTop;
        const height = el.offsetHeight;
        const bottom = top + height;

        const visibleTop = Math.max(top, scrollY);
        const visibleBottom = Math.min(bottom, bottomOffset);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          bestIndex = index;
        }
      });

      setActiveSection(bestIndex);
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row max-w-7xl mx-auto min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col lg:w-80 lg:h-screen lg:sticky lg:top-0 p-6 lg:p-8 bg-slate-900/70 backdrop-blur-xl border-r border-slate-700/50">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              GenFolio
            </h2>
            <p className="text-sm text-slate-400 mt-1">Design your future</p>
          </div>

          <nav className="space-y-2 flex-1">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 w-full ${
                  activeSection === index
                    ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                aria-label={`Go to ${section.label} section`}
              >
                <span className="text-xl" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="font-semibold text-sm lg:text-base">
                  {section.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Form */}
        <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-6">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8 lg:mb-10 text-center lg:text-left">
              <p className="text-sm sm:text-base text-cyan-300 font-medium mb-3 animate-fade-in">
                💤 Feeling lazy? We get it. Creating a portfolio sucks...{" "}
                <span className="block sm:inline mt-1 sm:mt-0 text-purple-300">
                  but this takes few minutes, not hours.
                </span>
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Craft Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Standout Portfolio
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
                Every detail you add shapes your professional story. Let’s make
                it unforgettable —{" "}
                <span className="text-cyan-300"> no fluff, just impact.</span>
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {sections.map((section, index) => (
                <section
                  id={`section-${index}`}
                  key={section.id}
                  className="scroll-mt-20 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  {sectionComponents[section.id]}
                </section>
              ))}

              <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group px-8 sm:px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[240px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Generating..." : "🚀 Generate Portfolio"}
                </button>

                {hasSavedData && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-8 sm:px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[240px]"
                  >
                    ♻ Reset Data
                  </button>
                )}
              </div>
              <p className="text-slate-500 text-sm mt-3 text-center">
                Instantly published • No setup needed
              </p>

              {/* Add the new line here */}
              <p className="text-slate-500 text-sm mt-6 text-center">
                Facing any issues?{" "}
                <a
                  href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=jaswanthsanivada87@gmail.com&su=Help%20with%20Portfolio&body=Hi%2C%20I%27m%20facing%20an%20issue%20with%20the%20portfolio%20builder.%20Can%20you%20help%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-medium"
                >
                  Click here to reach us
                </a>
                .
              </p>
            </form>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      {isMobile && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-full px-2 py-1 flex space-x-1 shadow-2xl z-50">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(index)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${
                activeSection === index
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-label={`Go to ${section.label}`}
            >
              <span aria-hidden="true">{section.icon}</span>
            </button>
          ))}
        </div>
      )}

      {/* Custom Scrollbar & Animations */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
