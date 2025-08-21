import React, { useEffect, useState, useId } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Mail,
  Book,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  Code,
  Briefcase,
  Award,
  Users,
  MessageCircle,
  MapPin,
  ChevronUp,
  ChevronDown,
  FileDown,
  GraduationCap,
} from "lucide-react";

const ModernPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Unique SVG gradient IDs
  const blueGradientId = useId();
  const purpleGradientId = useId();

  // Fetch user data
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/users/${id}`)
      .then((res) => {
        setUserData(res.data);
        document.title = res.data.name
          ? `${res.data.name} | Portfolio`
          : "Portfolio";
      })
      .catch((err) => {
        console.error("Error fetching portfolio:", err);
        setUserData(null);
      });
  }, [id]);

  // Scroll tracking
  useEffect(() => {
    const sections = [
      "home",
      "about",
      "education",
      "skills",
      "experience",
      "projects",
      "certifications",
      "contact",
    ];

    const handleScroll = () => {
      // Update active section
      const currentSection = sections.find((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }

      // Show "Back to Top" when near bottom
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 300;
      setShowBackToTop(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  // Scroll to section
  const handleScrollTo = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>
          <p className="text-gray-700 text-xl font-medium">Loading portfolio...</p>
          <p className="text-sm text-gray-500 mt-2">Just a moment</p>
        </div>
      </div>
    );
  }

  // Nav config - fixed duplicate Award icon
  const navConfig = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: Users },
    { id: "education", label: "Education", icon: Book },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code }, // Changed from Award to Code
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  // Helper: Should section be shown?
  const shouldShowSection = (id) => {
    switch (id) {
      case "home":
      case "contact":
        return true;
      case "about":
        return !!userData.experience;
      case "skills":
        return (
          (Array.isArray(userData.technicalSkills) && userData.technicalSkills.length > 0) ||
          (Array.isArray(userData.professionalSkills) && userData.professionalSkills.length > 0)
        );
      case "education":
        return userData.education?.some(
          (edu) =>
            edu.school?.trim() &&
            edu.degree?.trim() &&
            edu.field?.trim() &&
            edu.startDate
        );
      case "experience":
        return Array.isArray(userData.workExperience) && userData.workExperience.length > 0;
      case "projects":
        return Array.isArray(userData.projects) && userData.projects.length > 0;
      case "certifications":
        return userData.certifications?.length > 0; // Simplified
      default:
        return false;
    }
  };

  // Safe date formatter
  const getYear = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getFullYear()) ? "N/A" : date.getFullYear();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={scrollToTop}
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              Portfolio
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-2">
              {navConfig.map(({ id, label, icon: Icon }) => {
                const show = shouldShowSection(id);
                return show ? (
                  <button
                    key={id}
                    onClick={() => handleScrollTo(id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 group
                      ${activeSection === id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                      }`}
                  >
                    <Icon size={16} className="group-hover:scale-110 transition-transform" />
                    <span>{label}</span>
                  </button>
                ) : null;
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden mt-3 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col p-2">
                {navConfig.map(({ id, label, icon: Icon }) => {
                  const show = shouldShowSection(id);
                  return show ? (
                    <button
                      key={id}
                      onClick={() => handleScrollTo(id)}
                      className={`flex items-center space-x-3 px-5 py-4 rounded-xl font-medium transition-all
                        ${activeSection === id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "text-gray-700 hover:bg-blue-50"
                        }`}
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Home Section */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center px-6 py-12 sm:py-16 md:py-20 lg:py-28 bg-white overflow-hidden min-h-screen"
        style={{ minHeight: "100dvh" }}
      >
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 sm:py-8 md:py-0">
          <p className="text-lg md:text-xl font-medium text-blue-600">👋 Hello, I'm</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            {userData.name}
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-700 mb-4 leading-relaxed">
            {userData.headline}
          </p>
          <div className="inline-flex items-center px-5 py-2 bg-gray-100 text-gray-800 rounded-full font-semibold text-base mb-6 shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full mr-2 ${
                userData.experience === "Fresher" ? "bg-green-500" : "bg-blue-500"
              }`}
            ></span>
            {userData.experience === "Fresher" ? "Open to Work" : "Experienced"}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <button
              onClick={() => handleScrollTo("projects")}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:shadow-md hover:scale-105 transition-all duration-300 text-sm flex items-center space-x-1.5"
            >
              <Code size={16} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => handleScrollTo("contact")}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 hover:shadow transition-all duration-300 text-sm flex items-center space-x-1.5"
            >
              <Mail size={16} />
              <span>Contact</span>
            </button>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src={
                  userData.profilePhoto ||
                  "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg";
                }}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 w-full flex justify-center animate-bounce">
          <ChevronDown size={24} className="text-gray-500" />
        </div>
      </section>

      {/* About Section */}
      {userData.experience && (
        <section id="about" className="py-20 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 flex items-center justify-center gap-3 mb-4">
              <Users className="text-blue-500" size={36} />
              About Me
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              {userData.tagline}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {[
                { label: "Name", value: userData.name, icon: "👤", color: "blue" },
                {
                  label: "Qualification",
                  value: userData.highestQualification || "N/A",
                  icon: "🎓",
                  color: "indigo",
                },
                {
                  label: "Experience",
                  value: userData.experience,
                  icon: "💼",
                  color: "purple",
                },
                {
                  label: "Email",
                  value: userData.email,
                  icon: "📧",
                  color: "blue",
                },
                {
                  label: "Location",
                  value: userData.location || "N/A",
                  icon: "📍",
                  color: "gray",
                },
                {
                  label: "Freelance",
                  value: userData.freelanceAvailable ? "Available" : "Not Available",
                  icon: "🛠️",
                  color: userData.freelanceAvailable ? "green" : "red",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left ${
                    item.color === "green"
                      ? "bg-green-50 border-green-200"
                      : item.color === "red"
                      ? "bg-red-50 border-red-200"
                      : item.color === "blue"
                      ? "bg-blue-50 border-blue-200"
                      : item.color === "indigo"
                      ? "bg-indigo-50 border-indigo-200"
                      : item.color === "purple"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-500 truncate">
                        {item.label}
                      </p>
                      <p
                        className={`font-semibold text-base break-words ${
                          item.color === "green"
                            ? "text-green-700"
                            : item.color === "red"
                            ? "text-red-700"
                            : item.color === "blue"
                            ? "text-blue-700"
                            : item.color === "indigo"
                            ? "text-indigo-700"
                            : item.color === "purple"
                            ? "text-purple-700"
                            : "text-gray-800"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <div className="relative w-32 h-32 md:w-56 md:h-56 lg:w-64 lg:h-64">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full blur-lg opacity-40 transform rotate-6"></div>
                <div className="absolute inset-0 bg-white rounded-full shadow-2xl border border-gray-200 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src={
                      userData.gender === "Male"
                        ? "/man.jpg"
                        : userData.gender === "Female"
                        ? "/woman.jpg"
                        : "/other.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {userData.education?.length > 0 && (
        <section id="education" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="text-indigo-600" size={50} />
              Education
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed text-center">
              A journey of learning, growth, and academic excellence.
            </p>

            {(() => {
              const validEducation = userData.education.filter(
                (edu) =>
                  edu.school?.trim() &&
                  edu.degree?.trim() &&
                  edu.field?.trim() &&
                  edu.startDate
              );
              if (validEducation.length === 0) {
                return (
                  <div className="text-center py-12">
                    <p className="text-gray-500 italic text-lg">No education records available.</p>
                  </div>
                );
              }
              return (
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {validEducation.map((edu, idx) => (
                    <div
                      key={idx}
                      className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 text-center">
                        {getYear(edu.startDate)}
                        {edu.endDate ? ` – ${getYear(edu.endDate)}` : " – Present"}
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <GraduationCap size={18} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{edu.degree}</h3>
                            <p className="text-gray-600 text-sm">{edu.school}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-indigo-600 font-semibold text-sm">Major</p>
                          <p className="text-gray-700">{edu.field}</p>
                        </div>
                        {edu.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" /> {edu.location}
                          </p>
                        )}
                        {edu.grade && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                              GPA: {edu.grade}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {(userData.technicalSkills?.length > 0 || userData.professionalSkills?.length > 0) && (
        <section id="skills" className="py-20 sm:py-24 bg-white">
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id={blueGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id={purpleGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 flex items-center justify-center gap-3 mb-4">
              <Code className="text-green-500" size={36} />
              Skills & Expertise
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="mt-4 text-base sm:text-lg text-gray-600 text-center max-w-3xl mx-auto">
              Mastery measured not just in knowledge, but in impact.
            </p>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-16 gap-x-8 lg:gap-x-12 mt-12">
              {userData.technicalSkills?.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center md:justify-start">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 mr-3">
                      <Code size={20} />
                    </span>
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-10">
                    {userData.technicalSkills.map((skill) => {
                      const radius = 36;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference * (1 - skill.level / 100);
                      return (
                        <div
                          key={skill.name}
                          className="flex flex-col items-center space-y-3"
                          style={{ minWidth: "7rem" }}
                          title={`${skill.name}: ${skill.level}% proficiency`}
                        >
                          <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 transform rotate-270" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke="#E5E7EB"
                                strokeWidth="6"
                                fill="none"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke={`url(#${blueGradientId})`}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out origin-center"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-700">{skill.level}%</span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-800 text-center max-w-[8rem]">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {userData.professionalSkills?.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center md:justify-start">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 text-purple-600 mr-3">
                      <Users size={20} />
                    </span>
                    Soft Skills
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-10">
                    {userData.professionalSkills.map((skill) => {
                      const radius = 36;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference * (1 - skill.level / 100);
                      return (
                        <div
                          key={skill.name}
                          className="flex flex-col items-center space-y-3"
                          style={{ minWidth: "7rem" }}
                          title={`${skill.name}: ${skill.level}% strength`}
                        >
                          <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 transform rotate-270" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke="#E5E7EB"
                                strokeWidth="6"
                                fill="none"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke={`url(#${purpleGradientId})`}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out origin-center"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-700">{skill.level}%</span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-800 text-center max-w-[8rem]">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {Array.isArray(userData.projects) && userData.projects.length > 0 && (
        <section id="projects" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 text-center mb-4 flex items-center justify-center gap-3">
              <Code className="text-indigo-500" size={36} />
              My Projects
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mb-6"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explore some of the work I've built — from passion projects to full-scale applications.
            </p>
            <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              {userData.projects.map((p, idx) => (
                <div
                  key={idx}
                  className="group bg-white/70 backdrop-blur-lg border border-white/60 dark:border-gray-200/20 shadow-lg hover:shadow-2xl rounded-3xl p-6 sm:p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-105 will-change-transform"
                >
                  <div className="absolute -top-5 -left-5 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg text-white text-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 z-10">
                    {p.icon ? <span>{p.icon}</span> : <Code className="w-6 h-6" />}
                  </div>
                  <div className="relative mt-4 space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {p.title || "Untitled Project"}
                    </h3>
                    <p
                      className="text-gray-600 text-sm sm:text-base line-clamp-3"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.description || "No description provided."}
                    </p>
                    {Array.isArray(p.tags) && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.image && (
                      <div className="mt-4 rounded-xl overflow-hidden">
                        <img
                          src={p.image}
                          alt={`${p.title} screenshot`}
                          className="w-full h-40 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          loading="lazy"
                        />
                      </div>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm sm:text-base font-medium mt-4 transition-colors"
                      >
                        View Project
                        <ExternalLink size={16} className="group-hover:translate-x-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {userData.github && (
              <div className="text-center mt-16">
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Github size={20} />
                  <span>View More on GitHub</span>
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {userData.certifications?.length > 0 && (
        <section id="certifications" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4 flex items-center justify-center gap-3">
              <Award className="text-yellow-500" size={36} />
              Certifications
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed text-center">
              Recognized achievements and professional development from industry-leading platforms.
            </p>
            <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {userData.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="group bg-white/90 backdrop-blur-sm border border-white/60 dark:border-gray-200/10 shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-105 will-change-transform"
                >
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 px-6 py-5 text-white text-center relative">
                    <Award size={24} className="mx-auto mb-2" />
                    <h3 className="font-bold text-base sm:text-lg truncate">{cert.title}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Issued by</p>
                      <p className="text-gray-800 font-semibold text-base">{cert.issuer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-gray-700">{cert.date}</p>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-semibold mt-2 transition-colors group/link"
                      >
                        View Certificate
                        <ExternalLink
                          size={14}
                          className="opacity-0 group-hover/link:opacity-100"
                        />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {(userData.email ||
        userData.phone ||
        userData.linkedin ||
        userData.github ||
        userData.location ||
        userData.resume) && (
        <section id="contact" className="py-20 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-4 flex items-center justify-center gap-3">
              <MessageCircle className="text-pink-500" size={36} />
              Get In Touch
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto text-center">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="space-y-6">
                {userData.email && (
                  <a
                    href={`mailto:${userData.email}`}
                    className="flex items-center space-x-4 p-5 w-full border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-300 group"
                    aria-label="Email me"
                  >
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800 truncate">{userData.email}</span>
                  </a>
                )}
                {userData.phone && (
                  <a
                    href={`tel:${userData.phone}`}
                    className="flex items-center space-x-4 p-5 w-full border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:text-green-600 hover:shadow-md transition-all duration-300 group"
                    aria-label="Call me"
                  >
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800">{userData.phone}</span>
                  </a>
                )}
                {userData.location && (
                  <div className="flex items-center space-x-4 p-5 w-full border-2 border-gray-200 rounded-2xl group">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800 truncate">{userData.location}</span>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {userData.linkedin && (
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-5 w-full border-2 border-gray-200 rounded-2xl hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all duration-300 group"
                    aria-label="LinkedIn profile"
                  >
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800">LinkedIn Profile</span>
                  </a>
                )}
                {userData.github && (
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-5 w-full border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:text-gray-900 hover:shadow-md transition-all duration-300 group"
                    aria-label="GitHub profile"
                  >
                    <div className="p-3 bg-gray-100 text-gray-800 rounded-xl group-hover:scale-110 transition-transform">
                      <Github className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800">GitHub Profile</span>
                  </a>
                )}
                {userData.resume && (
                  <a
                    href={userData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-5 w-full border-2 border-indigo-500/20 bg-indigo-50 hover:bg-indigo-100 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all duration-300 group"
                    aria-label="Download resume"
                  >
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-800">Download Resume</span>
                  </a>
                )}
              </div>
            </div>
            <div className="text-center mt-12">
              <p className="text-gray-500 text-sm py-3">Looking forward to connecting with you! 🚀</p>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-black text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
                aria-label="Back to top"
              >
                <ChevronUp size={16} />
                Back to Top
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-lg">
            {userData.name}'s portfolio — always evolving, always learning.
          </p>
          <div className="flex justify-center space-x-8 mt-6">
            {userData.github && (
              <a
                href={userData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
            )}
            {userData.linkedin && (
              <a
                href={userData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-transform duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernPortfolio;