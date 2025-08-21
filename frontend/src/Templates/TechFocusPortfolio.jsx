import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  Code,
  Briefcase,
  Award,
  Users,
  MessageCircle,
  FileText,
  MapPin,
  Book,
  ArrowUp,
} from "lucide-react";

const TechFocusPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    education: useRef(null),
    skills: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    certifications: useRef(null),
    contact: useRef(null),
  };

  // Helper: Format URL with https
  const formatURL = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  // Helper: Safely format year from date string
  const formatYear = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return !isNaN(date) ? date.getFullYear() : "N/A";
  };

  // Fetch user data
  useEffect(() => {
    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      Object.keys(sectionRefs).forEach((key) => {
        const ref = sectionRefs[key]?.current;
        if (ref && ref.offsetTop <= scrollPos && ref.offsetTop + ref.offsetHeight > scrollPos) {
          setActiveSection(key);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (sectionId) => {
    const element = sectionRefs[sectionId]?.current;
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const showSection = (section) => {
    if (!userData) return false;
    switch (section) {
      case "about":
        return !!userData.tagline;
      case "education":
        return userData.education?.some(
          (edu) => edu.school?.trim() && edu.degree?.trim() && edu.field?.trim() && edu.startDate
        );
      case "skills":
        return (
          Array.isArray(userData.technicalSkills) && userData.technicalSkills.length > 0
        ) || (
          Array.isArray(userData.professionalSkills) && userData.professionalSkills.length > 0
        );
      case "experience":
        return Array.isArray(userData.workExperience) && userData.workExperience.length > 0;
      case "projects":
        return Array.isArray(userData.projects) && userData.projects.length > 0;
      case "certifications":
        return Array.isArray(userData.certifications) && userData.certifications.length > 0;
      case "contact":
        return !!(userData.email || userData.phone || userData.linkedin || userData.github || userData.resume);
      default:
        return true;
    }
  };

  const navItems = [
    "home",
    "about",
    "education",
    "skills",
    "experience",
    "projects",
    "certifications",
    "contact",
  ].filter(showSection);

  // Consistent labels
  const labels = {
    home: "Home",
    about: "About",
    education: "Education",
    skills: "Skills",
    experience: "Work",
    projects: "Projects",
    certifications: "Certs",
    contact: "Contact",
  };

  const icons = {
    home: Code,
    about: Users,
    education: Book,
    skills: Code,
    experience: Briefcase,
    projects: Code,
    certifications: Award,
    contact: MessageCircle,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse text-green-400 text-lg font-mono">
            [LOADING TECH PROFILE...]
          </div>
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-2xl text-red-500 font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The requested portfolio could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-x-hidden relative">
      {/* === GRID BACKGROUND === */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 100, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 100, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* === NAVBAR === */}
      <nav className="fixed w-full bg-black/90 backdrop-blur-md border-b border-green-500/30 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleScroll("home")}
              className="text-xl font-bold text-white hover:text-green-400 transition"
            >
              Portfolio
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-2">
              {navItems.map((id) => {
                const Icon = icons[id];
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleScroll(id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded text-sm transition-all font-bold ${
                      isActive
                        ? "text-green-400 bg-green-500/20 shadow-md shadow-green-500/30"
                        : "text-gray-300 hover:text-green-400 hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{labels[id]}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded border border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 bg-black/95 border border-green-500/30 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex flex-col space-y-1">
                {navItems.map((id) => {
                  const Icon = icons[id];
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleScroll(id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded text-sm transition-all ${
                        isActive
                          ? "text-green-400 bg-green-500/20 font-bold"
                          : "text-gray-300 hover:text-green-400"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{labels[id]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* === HERO === */}
      <section
        id="home"
        ref={sectionRefs.home}
        className="pt-32 pb-20 px-6 min-h-screen flex items-center relative"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                <span className="text-green-400">const</span>{" "}
                {userData.name?.trim().replace(/\s+/g, "_") || "Dev"}{" "}
                <span className="text-green-400">=</span>{" "}
                <span className="text-cyan-400">new</span>{" "}
                <span className="text-white">Developer</span>
                <span className="text-green-400">();</span>
              </h1>
              <p className="text-xl sm:text-2xl text-green-300 font-light">
                {userData.headline || "Developer | Problem Solver"}
              </p>
              <div className="bg-black/80 border border-green-500/40 rounded-xl p-4 sm:p-6 max-w-xl mx-auto lg:mx-0 font-mono text-xs sm:text-sm shadow-2xl">
                <div className="flex space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-green-400 text-left leading-relaxed">
                  <div className="flex">
                    <span className="text-gray-500 opacity-70">$ </span>
                    <span className="ml-1">init_profile --verbose</span>
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap text-xs sm:text-sm">
{`{
  "name": "${userData.name || "John Doe"}",
  "role": "${userData.headline || "Software Engineer"}",
  "status": "${userData.experience || "Unknown"}",
  "focus": ["${userData.technicalSkills?.[0]?.name || "React"}", "${
                    userData.technicalSkills?.[1]?.name || "Node.js"
                  }", "${userData.technicalSkills?.[2]?.name || "Tailwind"}"]
}`}
                  </pre>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => handleScroll("projects")}
                  className="px-6 py-2.5 sm:px-7 sm:py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-black font-bold rounded-lg hover:from-green-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-green-500/30 transform hover:scale-105"
                >
                  Explore Projects
                </button>
                <button
                  onClick={() => handleScroll("contact")}
                  className="px-6 py-2.5 sm:px-7 sm:py-3 border border-green-500 text-green-400 font-bold rounded-lg hover:bg-green-500/10 hover:text-white transition-all transform hover:scale-105"
                >
                  Connect
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-end">
              <div className="relative mb-4">
                <div className="absolute inset-0 w-80 h-80 bg-green-500 rounded-full blur-3xl opacity-20 -z-10"></div>
                <img
                  src={
                    userData.profilePhoto ||
                    "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"
                  }
                  alt="Profile"
                  className="w-52 h-52 sm:w-64 sm:h-64 object-cover rounded-full border-4 border-green-500 shadow-2xl transition-transform duration-500 hover:scale-105"
                  onError={(e) =>
                    (e.target.src =
                      "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg")
                  }
                />
                <div className="absolute -inset-1 rounded-full border-2 border-dashed border-green-500/50 animate-pulse"></div>
              </div>
              {userData.experience === "Fresher" && (
                <div className="mt-2 px-5 py-2 bg-green-600 text-black font-bold text-sm rounded-full animate-pulse shadow-md transform hover:scale-105 transition">
                  🚀 OPEN TO TECH OPPORTUNITIES
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <button
            onClick={() => {
              const nextSection = userData.tagline ? "about" : "skills";
              handleScroll(nextSection);
            }}
            aria-label="Scroll down"
            className="text-green-400 hover:text-cyan-400 transition-colors duration-300 md:flex hidden"
          >
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 8l7 7 7-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* === ABOUT === */}
      {showSection("about") && (
        <section id="about" ref={sectionRefs.about} className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 mb-6 flex items-center justify-center gap-3 tracking-tight">
                <span className="p-2 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                About
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                A glimpse into who I am and what drives me.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                  {userData.tagline}
                </p>
                <div className="space-y-4 font-mono text-sm sm:text-base">
                  {userData.name && (
                    <div className="flex justify-between border-b border-green-500/30 pb-2">
                      <span className="text-green-400 font-bold">Name</span>
                      <span className="text-white text-right">{userData.name}</span>
                    </div>
                  )}
                  {userData.highestQualification && (
                    <div className="flex justify-between border-b border-green-500/30 pb-2">
                      <span className="text-green-400 font-bold">Highest Qualification</span>
                      <span className="text-white text-right">{userData.highestQualification}</span>
                    </div>
                  )}
                  {userData.experience && (
                    <div className="flex justify-between border-b border-green-500/30 pb-2">
                      <span className="text-green-400 font-bold">Experience</span>
                      <span className="text-white text-right">{userData.experience}</span>
                    </div>
                  )}
                  {userData.location && (
                    <div className="flex justify-between border-b border-green-500/30 pb-2">
                      <span className="text-green-400 font-bold">Location</span>
                      <span className="text-white text-right">{userData.location}</span>
                    </div>
                  )}
                  {userData.email && (
                    <div className="flex justify-between border-b border-green-500/30 pb-2">
                      <span className="text-green-400 font-bold">Email</span>
                      <a
                        href={`mailto:${userData.email}`}
                        className="text-cyan-400 hover:underline hover:text-cyan-300 transition text-right"
                      >
                        {userData.email}
                      </a>
                    </div>
                  )}
                  {userData.freelanceAvailable !== null && (
                    <div className="flex justify-between">
                      <span className="text-green-400 font-bold">Freelance</span>
                      <span
                        className={`${
                          userData.freelanceAvailable
                            ? "text-green-400 font-bold animate-pulse"
                            : "text-red-400"
                        } text-right`}
                      >
                        {userData.freelanceAvailable ? "Available 🚀" : "Not Available"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute inset-0 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-20 -z-10 group-hover:opacity-30 transition"></div>
                  <img
                    src={
                      userData.gender === "Male"
                        ? "/man.jpg"
                        : userData.gender === "Female"
                        ? "/woman.jpg"
                        : "/other.jpg"
                    }
                    alt="Avatar"
                    className="w-48 h-48 sm:w-52 sm:h-52 object-cover rounded-full border-4 border-green-500 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute -inset-2 rounded-full border-2 border-dashed border-green-500/50 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* === EDUCATION === */}
      {showSection("education") && (
        <section id="education" ref={sectionRefs.education} className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 mb-6 flex items-center justify-center gap-3 tracking-tight">
                <span className="p-2 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H17.5A2.5 2.5 0 0 1 20 4.5v15"></path>
                    <polyline points="12 8 8 12 12 16"></polyline>
                    <line x1="16" y1="12" x2="8" y2="12"></line>
                  </svg>
                </span>
                Education
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                Academic journey and qualifications that shaped my expertise.
              </p>
            </div>
            {(() => {
              const validEducation = (userData.education || []).filter(
                (edu) =>
                  edu.school?.trim() &&
                  edu.degree?.trim() &&
                  edu.field?.trim() &&
                  edu.startDate
              );
              if (validEducation.length === 0) {
                return (
                  <div className="text-center py-10">
                    <p className="text-gray-500 italic">No complete education records to display.</p>
                  </div>
                );
              }
              return (
                <div className="grid gap-6">
                  {validEducation.map((edu, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group hover:shadow-xl hover:shadow-green-500/10"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                            {edu.degree}
                          </h3>
                          <p className="text-cyan-400 font-semibold text-sm sm:text-base">
                            {edu.field}
                          </p>
                          <p className="text-gray-200 mt-1">{edu.school}</p>
                          {edu.location && (
                            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                              <MapPin size={14} className="inline" /> {edu.location}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right mt-3 sm:mt-0">
                          <p className="text-gray-300 text-sm sm:text-base">
                            {formatYear(edu.startDate)} – {formatYear(edu.endDate)}
                          </p>
                          {edu.grade && (
                            <p className="text-green-400 font-bold text-sm mt-1 bg-green-400/10 px-3 py-1 rounded-full inline-block">
                              GPA: {edu.grade}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* === SKILLS === */}
      {showSection("skills") && (
        <section id="skills" ref={sectionRefs.skills} className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 mb-6 flex items-center justify-center gap-3 tracking-tight">
                <span className="p-2 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </span>
                Skills
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                Technical and soft skills that power my work.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-16">
              {userData.technicalSkills?.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-400" />
                    Technical Skills
                  </h3>
                  <div className="flex justify-between uppercase tracking-wider text-gray-500 font-semibold mb-1 text-xs sm:text-sm">
                    <span>Skill</span>
                    <span>Proficiency</span>
                  </div>
                  <div className="space-y-6">
                    {userData.technicalSkills
                      .slice()
                      .sort((a, b) => b.level - a.level)
                      .map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-200 font-mono font-medium">{skill.name}</span>
                            <span className="text-gray-400 tabular-nums">{skill.level}%</span>
                          </div>
                          <div className="relative h-1 bg-gray-900 border border-gray-800 rounded group">
                            <div
                              className="absolute top-0 left-0 h-full bg-green-400 rounded"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                            <div
                              className="absolute top-1/2 w-3 h-3 bg-green-400 border-2 border-green-200 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg transition-all duration-300 group-hover:bg-green-300 group-hover:scale-125"
                              style={{ left: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {userData.professionalSkills?.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Soft Skills
                  </h3>
                  <div className="flex justify-between uppercase tracking-wider text-gray-500 font-semibold mb-1 text-xs sm:text-base">
                    <span>Skill</span>
                    <span>Proficiency</span>
                  </div>
                  <div className="space-y-6">
                    {userData.professionalSkills
                      .slice()
                      .sort((a, b) => b.level - a.level)
                      .map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-200 font-mono font-medium">{skill.name}</span>
                            <span className="text-gray-400 tabular-nums">{skill.level}%</span>
                          </div>
                          <div className="relative h-1 bg-gray-900 border border-gray-800 rounded group">
                            <div
                              className="absolute top-0 left-0 h-full bg-cyan-400 rounded"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                            <div
                              className="absolute top-1/2 w-3 h-3 bg-cyan-400 border-2 border-cyan-200 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg transition-all duration-300 group-hover:bg-cyan-300 group-hover:scale-125"
                              style={{ left: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* === EXPERIENCE === */}
      {showSection("experience") && (
        <section id="experience" ref={sectionRefs.experience} className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 mb-6 flex items-center justify-center gap-3 tracking-tight">
                <span className="p-2 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </span>
                Work History
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                A live feed of professional milestones.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {Array.isArray(userData.workExperience) &&
                userData.workExperience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="group bg-black/70 border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-500/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    <div className="bg-black/50 border-b border-green-500/30 px-5 py-3 font-mono text-sm flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                            {exp.role}
                          </h3>
                          <p className="text-green-400 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-cyan-400 font-mono text-sm bg-cyan-500/10 px-3 py-1 rounded-full mt-1 sm:mt-0">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed italic">“{exp.description}”</p>
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {exp.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-gradient-to-r from-green-900 to-cyan-900 text-green-300 border border-green-500/30 rounded font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {exp.companyWebsite && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <a
                            href={formatURL(exp.companyWebsite)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-400 text-sm font-medium hover:text-green-300 transition-colors group/link"
                          >
                            Visit Company
                            <ExternalLink
                              size={14}
                              className="ml-1 opacity-0 group-hover/link:opacity-100 transition-all duration-300"
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* === PROJECTS === */}
      {showSection("projects") && (
        <section id="projects" ref={sectionRefs.projects} className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 mb-6 flex items-center justify-center gap-3 tracking-tight">
                <span className="p-2 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </span>
                Featured Projects
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                Cutting-edge builds that blend creativity, code, and clean design.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(userData.projects) &&
                userData.projects.map((p, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-green-500/50 hover:bg-gray-800/80 hover:shadow-xl hover:shadow-green-500/10 flex flex-col h-full"
                  >
                    <div className="relative h-48 bg-black flex items-center justify-center overflow-hidden">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title || "Project screenshot"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-gray-600 text-5xl font-mono font-bold select-none group-hover:text-green-400 transition-colors duration-300">
                          {"{ }"}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-gray-900/30 pointer-events-none"></div>
                    </div>
                    {p.status && (
                      <div
                        className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full z-10 ${
                          p.status === "live"
                            ? "bg-green-400"
                            : p.status === "beta"
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                        }`}
                        title={`Status: ${p.status}`}
                      ></div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors duration-300 line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {p.description}
                      </p>
                      {p.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {p.tags.slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded font-mono bg-gray-800/60 text-gray-300 border border-gray-600/50 transition-colors duration-200 group-hover:border-green-500/40"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        {p.link ? (
                          <a
                            href={formatURL(p.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-400 text-sm font-medium hover:text-green-300 transition-colors group/link"
                          >
                            View Project
                            <ExternalLink
                              size={14}
                              className="ml-1 opacity-0 group-hover/link:opacity-100 transition-all duration-300"
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">Private</span>
                        )}
                        {p.source && (
                          <a
                            href={formatURL(p.source)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
                          >
                            src
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {userData.github && (
              <div className="text-center mt-12">
                <a
                  href={formatURL(userData.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-green-400 font-bold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-green-500/20 transform hover:scale-105 border border-green-500/30"
                >
                  <Github size={18} className="mr-2" />
                  View More Projects on GitHub
                  <ExternalLink size={14} className="ml-2" />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* === CERTIFICATIONS === */}
      {showSection("certifications") && (
        <section id="certifications" ref={sectionRefs.certifications} className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-4xl"></div>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 mb-6 flex items-center justify-center gap-3 tracking-tight">
                <span className="p-2 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                </span>
                Certifications
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                Verified expertise in modern technologies and frameworks.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.isArray(userData.certifications) &&
                userData.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-gradient-to-br from-gray-900/60 to-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-7 hover:border-cyan-400/40 hover:from-gray-900/80 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {cert.icon ? (
                        <img src={cert.icon} alt="Cert icon" className="w-6 h-6" />
                      ) : (
                        <Award className="w-6 h-6" />
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1.5 line-clamp-2 group-hover:text-cyan-200 transition-colors duration-300">
                      {cert.title}
                    </h3>
                    <p className="text-cyan-300 text-sm font-medium mb-1">by {cert.issuer}</p>
                    <p className="text-gray-400 text-xs mb-4">{cert.date}</p>
                    {cert.link && (
                      <a
                        href={formatURL(cert.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-200 transition-colors duration-200 group/link"
                      >
                        Verify Certificate
                        <ExternalLink
                          size={12}
                          className="ml-1 opacity-0 group-hover/link:opacity-100 transition-all duration-300"
                        />
                      </a>
                    )}
                    {cert.badge && (
                      <span className="absolute top-6 right-6 text-xs px-2 py-1 rounded-full bg-black/70 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                        {cert.badge}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* === CONTACT === */}
      {showSection("contact") && (
        <section id="contact" ref={sectionRefs.contact} className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-4xl"></div>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-blue-400 mb-6 flex items-center justify-center gap-3 tracking-tight">
                <span className="p-2 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </span>
                Let’s Connect
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                Have a project in mind? I'm always open to discussing new opportunities.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {userData.email && (
                <a
                  href={`mailto:${userData.email}`}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-sm border border-green-500/20 text-center hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 rounded-xl bg-green-500/10 text-green-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Email</p>
                      <p className="text-gray-400 text-xs mt-1 font-mono truncate max-w-[140px] mx-auto">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </a>
              )}
              {userData.phone && (
                <a
                  href={`tel:${userData.phone}`}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-sm border border-cyan-500/20 text-center hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Phone</p>
                      <p className="text-gray-400 text-xs mt-1 font-mono">{userData.phone}</p>
                    </div>
                  </div>
                </a>
              )}
              {userData.location && (
                <div className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-sm border border-gray-600/30 text-center hover:border-gray-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/5">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 rounded-xl bg-gray-700/50 text-gray-300 group-hover:scale-110 transition-transform duration-300">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Location</p>
                      <p className="text-gray-400 text-xs mt-1">{userData.location}</p>
                    </div>
                  </div>
                </div>
              )}
              {userData.resume && (
                <a
                  href={formatURL(userData.resume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-sm border border-green-500/20 text-center hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 text-green-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Resume</p>
                      <p className="text-gray-400 text-xs mt-1">Download CV</p>
                    </div>
                  </div>
                </a>
              )}
            </div>
            <div className="flex justify-center space-x-8">
              {userData.linkedin && (
                <a
                  href={formatURL(userData.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 group"
                  aria-label="LinkedIn"
                >
                  <div className="flex flex-col items-center">
                    <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-600 mt-1">LinkedIn</span>
                  </div>
                </a>
              )}
              {userData.github && (
                <a
                  href={formatURL(userData.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 group"
                  aria-label="GitHub"
                >
                  <div className="flex flex-col items-center">
                    <Github size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-600 mt-1">GitHub</span>
                  </div>
                </a>
              )}
            </div>

            {/* Back to Top Button */}
            <div className="text-center mt-16">
              <button
                onClick={() => handleScroll("home")}
                aria-label="Back to top"
                className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-black font-bold rounded-lg hover:from-green-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-green-500/30 transform hover:scale-105"
              >
                <ArrowUp size={16} className="mr-2" />
                Back to Top
              </button>
            </div>
          </div>
        </section>
      )}

      {/* === FOOTER === */}
      <footer className="py-8 border-t border-green-500/20 text-center text-gray-400 text-sm leading-relaxed">
        <div className="max-w-5xl mx-auto px-6">
          <p className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-sm">
            <span>© {new Date().getFullYear()} {userData.name}</span>
            <span className="hidden md:inline">•</span>
            <span>Built with precision using modern web technologies</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TechFocusPortfolio;