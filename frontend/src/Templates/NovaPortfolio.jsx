import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Code,
  Briefcase,
  Users,
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  Globe,
} from "lucide-react";

const NovaPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [loadedSections, setLoadedSections] = useState(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/users/${id}`)
      .then((res) => {
        setUserData(res.data);
        document.title = `${res.data.name || "Professional Profile"} | Portfolio`;
      })
      .catch((err) => {
        console.error("Error fetching portfolio:", err);
        setUserData({});
      });
  }, [id]);

  // Filtered data with useMemo
  const filteredEducation = useMemo(
    () =>
      (userData?.education || []).filter(
        (e) => e.school && e.degree
      ),
    [userData?.education]
  );
  const filteredExperience = useMemo(() => userData?.workExperience || [], [userData?.workExperience]);
  const filteredProjects = useMemo(() => userData?.projects || [], [userData?.projects]);
  const filteredCertifications = useMemo(() => userData?.certifications || [], [userData?.certifications]);
  const filteredTechnicalSkills = useMemo(() => userData?.technicalSkills || [], [userData?.technicalSkills]);
  const filteredProfessionalSkills = useMemo(() => userData?.professionalSkills || [], [userData?.professionalSkills]);

  // Show section flags
  const showEducation = filteredEducation.length > 0;
  const showExperience = filteredExperience.length > 0;
  const showProjects = filteredProjects.length > 0;
  const showCertifications = filteredCertifications.length > 0;
  const showSkills = filteredTechnicalSkills.length > 0 || filteredProfessionalSkills.length > 0;

  // Deep linking with hashchange support
  useEffect(() => {
    const validSections = [
      "home",
      "education",
      "skills",
      "experience",
      "projects",
      "certifications",
      "contact",
    ];

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (validSections.includes(hash)) {
        setActiveSection(hash);
        setLoadedSections((prev) => new Set([...prev, hash]));
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            setLoadedSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { root: null, threshold: 0.25, rootMargin: "-100px 0px -100px 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [userData]);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    if (menuOpen) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-t-teal-500 border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-xl font-light">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Orbit positions with full text
  const orbitPositions = [
    {
      label: "Location",
      value: userData.location,
      className: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
      label: "Experience",
      value: userData.experience ,
      className: "top-1/4 left-0 -translate-x-1/2 -translate-y-1/2",
    },
    {
      label: "Freelance",
      value: userData.freelanceAvailable ? "Available" : "Not Available",
      className: "top-1/4 right-0 translate-x-1/2 -translate-y-1/2",
    },
    {
      label: "Qualification",
      value:
        userData.highestQualification,
      className: "bottom-1/4 left-0 -translate-x-1/2 translate-y-1/2",
    },
    {
      label: "Email",
      value: userData.email ,
      className: "bottom-1/4 right-0 translate-x-1/2 translate-y-1/2",
    },
  ];

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false); // Close mobile menu
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 relative font-sans antialiased selection:bg-teal-500/30">
      {/* === Navigation === */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/90 border-b border-slate-700/50 px-6 py-4">
  <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
    <h1
      onClick={() => scrollToSection("home")}
      className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-teal-100 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition"
      aria-label="Back to top"
    >
      Portfolio
    </h1>

    {/* Desktop Nav */}
    <div className="hidden md:flex space-x-8 text-sm font-medium">
      {[
        { key: "home", label: "Home" },
        showEducation && { key: "education", label: "Education" },
        showSkills && { key: "skills", label: "Skills" },
        showExperience && { key: "experience", label: "Experience" },
        showProjects && { key: "projects", label: "Projects" },
        showCertifications && { key: "certifications", label: "Certifications" },
        (userData.email || userData.phone || userData.linkedin || userData.github) && {
          key: "contact",
          label: "Contact",
        },
      ]
        .filter(Boolean)
        .map((item) => (
          <button
            key={item.key}
            onClick={() => {
              scrollToSection(item.key);
              if (window.innerWidth <= 768) setMenuOpen(false); // Close mobile menu on click
            }}
            className={`capitalize transition-all duration-300 hover:text-teal-400 relative ${
              activeSection === item.key
                ? "text-teal-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
            aria-current={activeSection === item.key ? "page" : undefined}
          >
            {item.label}
            {activeSection === item.key && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 rounded-full"></span>
            )}
          </button>
        ))}
    </div>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="md:hidden text-gray-300 focus:outline-none"
      aria-expanded={menuOpen}
      aria-label="Toggle menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
        />
      </svg>
    </button>
  </div>

  {/* Mobile Menu Overlay */}
  {menuOpen && (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Menu Panel */}
      <div className="relative bg-slate-900/95 border-t border-slate-700 px-6 py-4 w-full max-w-xs mx-auto mt-20 shadow-xl">
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col space-y-4 text-center">
          {[
            { key: "home", label: "Home" },
            showEducation && { key: "education", label: "Education" },
            showSkills && { key: "skills", label: "Skills" },
            showExperience && { key: "experience", label: "Experience" },
            showProjects && { key: "projects", label: "Projects" },
            showCertifications && { key: "certifications", label: "Certifications" },
            (userData.email || userData.phone || userData.linkedin || userData.github) && {
              key: "contact",
              label: "Contact",
            },
          ]
            .filter(Boolean)
            .map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  scrollToSection(item.key);
                  setMenuOpen(false); // Close menu after selection
                }}
                className={`capitalize py-2 transition-colors ${
                  activeSection === item.key
                    ? "text-teal-400 font-semibold"
                    : "text-gray-300"
                }`}
                aria-current={activeSection === item.key ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  )}
</nav>

      {/* === Home Section === */}
      <section
        id="home"
        className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden"
      >
        <div className="text-center z-30 mb-8 max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
            {userData.name || "No Name"}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-teal-400 font-medium mb-2">
            {userData.headline || "Full Stack Developer"}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
            {userData.tagline || "Building apps that scale"}
          </p>
        </div>

        {/* Orbit Layout */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto mt-6 sm:mt-8">
          {/* Outer Circle */}
          <div className="absolute inset-0 rounded-full border border-teal-500/40"></div>

          {/* Profile Image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative inline-block">
              <img
                src={
                  userData.profilePhoto ||
                  "https://placehold.co/150x150/1e293b/ffffff?text=Me"
                }
                alt={userData.name || "Profile"}
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover rounded-full border-4 border-teal-400 shadow-lg"
              />

              {/* Open to Work Tag */}
              {userData.experience === "Fresher" && (
  <span
    className="absolute left-1/2 -bottom-14 -translate-x-1/2 
      bg-green-600 text-white text-xs font-semibold px-3 py-1 
      rounded-full shadow-md border border-white/20 whitespace-nowrap
      animate-blink
      sm:left-auto sm:-bottom-1 sm:right-0 sm:translate-x-0 sm:transform-none
      md:right-1 md:-bottom-2 md:px-4 md:py-1.5 md:text-sm
      z-10"
  >
    OPEN TO WORK
  </span>
)}
            </div>
          </div>

          {/* Orbit Items */}
          {orbitPositions.map((item) => (
            <div
              key={item.label}
              className={`absolute bg-slate-800/90 border border-teal-500/50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-center text-xs sm:text-sm whitespace-normal transition-all duration-300 hover:scale-105 ${item.className}`}
            >
              <div className="text-teal-300 font-medium text-xs sm:text-sm">
                {item.label}
              </div>
              <div className="text-teal-200 text-xs sm:text-sm">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Education === */}
      {showEducation && (
        <section
          id="education"
          className={`py-20 px-6 ${
            loadedSections.has("education") ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 relative inline-block">
              Education
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-yellow-400 rounded-full"></span>
            </h2>
            <div className="space-y-10">
              {filteredEducation.map((edu, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col sm:flex-row gap-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-md hover:shadow-teal-500/20 transition-all p-6 group"
                >
                  <div className="sm:w-1/3 flex flex-col items-start sm:items-center text-left sm:text-center">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Calendar size={14} className="text-teal-400" aria-hidden="true" />
                      {new Date(edu.startDate).getFullYear()} –{" "}
                      {edu.endDate
                        ? new Date(edu.endDate).getFullYear()
                        : "Present"}
                    </div>
                    {edu.grade && (
                      <div className="mt-2 text-base font-semibold text-teal-300 border-l-4 sm:border-l-0 sm:border-t-4 border-teal-500 pl-2 sm:pl-0 sm:pt-2">
                        Grade: {edu.grade}
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block w-px bg-gradient-to-b from-blue-500/50 to-teal-500/50" />
                  <div className="sm:w-2/3">
                    <h3 className="text-2xl font-semibold text-white group-hover:text-teal-300 transition">
                      {edu.degree}
                    </h3>
                    <p className="text-teal-400 font-medium">{edu.field}</p>
                    <p className="text-gray-300">{edu.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Skills === */}
      {showSkills && (
        <section
          id="skills"
          className={`py-20 px-6 ${
            loadedSections.has("skills") ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 relative inline-block">
              Skills
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-yellow-400 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredTechnicalSkills.length > 0 && (
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-lg">
                  <h3 className="text-3xl font-semibold text-teal-400 mb-8 flex justify-center items-center gap-3">
                    <Code size={26} aria-hidden="true" /> Technical
                  </h3>
                  <div className="flex justify-center items-end gap-8 h-80">
                    {filteredTechnicalSkills.map((s, idx) => (
                      <div
                        key={`tech-${idx}`}
                        className="flex flex-col items-center relative"
                      >
                        <span className="text-teal-400 font-bold mb-2">
                          {s.level}%
                        </span>
                        <div
                          className="w-14 rounded-2xl shadow-md transition-all duration-1000 transform hover:scale-105 bg-gradient-to-t from-teal-500 to-blue-500"
                          style={{ height: `${s.level * 1.8}px` }}
                        ></div>
                        <span className="mt-3 text-white font-medium text-center">
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {filteredProfessionalSkills.length > 0 && (
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-lg">
                  <h3 className="text-3xl font-semibold text-emerald-400 mb-8 flex justify-center items-center gap-3">
                    <Users size={26} aria-hidden="true" /> Professional
                  </h3>
                  <div className="flex justify-center items-end gap-8 h-80">
                    {filteredProfessionalSkills.map((s, idx) => (
                      <div
                        key={`prof-${idx}`}
                        className="flex flex-col items-center relative"
                      >
                        <span className="text-emerald-400 font-bold mb-2">
                          {s.level}%
                        </span>
                        <div
                          className="w-14 rounded-2xl shadow-md transition-all duration-1000 transform hover:scale-105 bg-gradient-to-t from-emerald-500 to-teal-500"
                          style={{ height: `${s.level * 1.8}px` }}
                        ></div>
                        <span className="mt-3 text-white font-medium text-center">
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* === Experience === */}
      {showExperience && (
        <section
          id="experience"
          className={`py-20 px-6 ${
            loadedSections.has("experience") ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 relative inline-block">
              Work Experience
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-yellow-400 rounded-full"></span>
            </h2>
            <div className="space-y-8">
              {filteredExperience.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row bg-slate-800/60 rounded-xl border-l-4 border-teal-500 p-6 hover:border-teal-400 transition-all shadow-md"
                >
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 flex items-start">
                    <span className="bg-teal-500 p-3 rounded-lg flex items-center justify-center shadow-lg">
                      <Briefcase size={22} className="text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-teal-400">
                          {exp.role}
                        </h3>
                        <h4 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                          {exp.company}
                          {exp.companyLogo && (
                            <img
                              src={exp.companyLogo}
                              alt={`${exp.company} logo`}
                              className="w-6 h-6 object-contain rounded-full"
                            />
                          )}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-400 flex items-center gap-1 mt-2 sm:mt-0">
                        <Calendar size={14} aria-hidden="true" /> {exp.duration}
                      </span>
                    </div>
                    {exp.companyWebsite && (
                      <a
                        href={exp.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-teal-400 hover:underline inline-flex items-center gap-1 mt-2"
                      >
                        Visit Site <Globe size={12} aria-hidden="true" />
                      </a>
                    )}
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Projects === */}
      {showProjects && (
        <section
          id="projects"
          className={`py-20 px-6 ${
            loadedSections.has("projects") ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 relative inline-block">
              Projects
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-yellow-400 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-b from-slate-800/70 to-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-teal-500 transition-all duration-300 shadow-lg hover:shadow-teal-500/20 group"
                >
                  <h3 className="text-2xl font-semibold text-white group-hover:text-teal-300 mb-3">
                    {proj.title}
                  </h3>
                  <p className="text-gray-300 mb-5 leading-relaxed min-h-[80px]">
                    {proj.description}
                  </p>
                  {proj.tech && proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {proj.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 text-sm font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        Live Demo <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    )}
                    {proj.repo && (
                      <a
                        href={proj.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 text-sm font-medium inline-flex items-center gap-1 hover:text-white"
                      >
                        GitHub <Github size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {userData.github && (
              <div className="flex justify-center mt-10">
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-xl border border-gray-600 shadow-md transition-all hover:shadow-lg"
                >
                  <Github size={18} aria-hidden="true" />
                  View More Projects on GitHub
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* === Certifications === */}
      {showCertifications && (
        <section
          id="certifications"
          className={`py-20 px-6 ${
            loadedSections.has("certifications") ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 relative inline-block">
              Certifications
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-yellow-400 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCertifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-yellow-500/30 transition-all shadow-lg hover:shadow-yellow-500/20"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Issued by: <span className="font-medium">{cert.issuer}</span>
                  </p>
                  <p className="text-gray-400 flex items-center gap-1 text-xs">
                    <Calendar size={14} aria-hidden="true" /> {cert.date}
                  </p>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-1 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-sm font-medium rounded-lg transition-colors"
                    >
                      View Certificate
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Contact === */}
      {(userData.email || userData.phone || userData.linkedin || userData.github) && (
        <section
          id="contact"
          className={`py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-950 to-black ${
            loadedSections.has("contact") ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 relative inline-block">
              Let's Connect
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-yellow-400 rounded-full"></span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl mb-12 max-w-xl mx-auto">
              I’m open to collaboration, new opportunities, or just a friendly chat. Reach out via any platform below!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {userData.email && (
                <a
                  href={`mailto:${userData.email}`}
                  className="group relative block p-6 rounded-xl bg-gray-800 hover:bg-teal-700/20 transition-all shadow-lg flex flex-col items-center text-center"
                >
                  <Mail size={24} className="text-teal-400 mb-3" aria-hidden="true" />
                  <p
                    className="text-gray-200 font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                    title={userData.email}
                  >
                    {userData.email}
                  </p>
                  <span className="text-xs text-gray-400 mt-1">Email Me</span>
                </a>
              )}
              {userData.phone && (
                <a
                  href={`tel:${userData.phone}`}
                  className="group relative block p-6 rounded-xl bg-gray-800 hover:bg-green-700/20 transition-all shadow-lg flex flex-col items-center text-center"
                >
                  <Phone size={24} className="text-green-400 mb-3" aria-hidden="true" />
                  <p
                    className="text-gray-200 font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                    title={userData.phone}
                  >
                    {userData.phone}
                  </p>
                  <span className="text-xs text-gray-400 mt-1">Call Me</span>
                </a>
              )}
              {userData.linkedin && (
                <a
                  href={userData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block p-6 rounded-xl bg-gray-800 hover:bg-blue-700/20 transition-all shadow-lg flex flex-col items-center text-center"
                >
                  <Linkedin size={24} className="text-blue-400 mb-3" aria-hidden="true" />
                  <p className="text-gray-200 font-semibold text-sm">LinkedIn</p>
                  <span className="text-xs text-gray-400 mt-1">Connect</span>
                </a>
              )}
              {userData.github && (
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block p-6 rounded-xl bg-gray-800 hover:bg-gray-700/20 transition-all shadow-lg flex flex-col items-center text-center"
                >
                  <Github size={24} className="text-gray-300 mb-3" aria-hidden="true" />
                  <p className="text-gray-200 font-semibold text-sm">GitHub</p>
                  <span className="text-xs text-gray-400 mt-1">View Projects</span>
                </a>
              )}
            </div>

            <div className="flex flex-col items-center mt-10">
              {userData.resume && (
                <a
                  href={userData.resume}
                  download={userData.name ? `${userData.name}_Resume.pdf` : ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all text-lg mb-8"
                >
                  📄 Download Resume
                </a>
              )}

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group px-7 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                <span className="font-bold transform group-hover:-translate-y-1 transition-transform duration-300">
                  ↑
                </span>
                Back to Top
              </button>
            </div>
          </div>
        </section>
      )}

      {/* === Footer === */}
      <footer className="py-8 border-t border-slate-800 text-center text-gray-500 text-sm sm:text-base">
        <p>© {new Date().getFullYear()} {userData.name}</p>
        <p className="text-gray-600 mt-1">A student's journey of code, creativity, and continuous learning 📚✨</p>
      </footer>

      {/* === Animations === */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.6; }
        }
        .animate-blink {
          animation: blink 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NovaPortfolio;