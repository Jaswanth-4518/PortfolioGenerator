import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Code,
  Briefcase,
  Award,
  Users,
  MessageCircle,
  Book,
} from "lucide-react";

const MinimalistPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show button when user has scrolled past 80% of the page
      if (scrollTop + windowHeight > documentHeight * 0.8) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll listener for active section
  useEffect(() => {
    const handleScroll = () => {
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
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial active section
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section and close mobile menu
  const handleScroll = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-white text-lg">Loading portfolio...</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: Code },
    { id: "about", label: "About", icon: Users },
    { id: "education", label: "Education", icon: Book },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  // Filter visible items
  const visibleItems = navItems.filter((item) => {
    switch (item.id) {
      case "about":
        return !!userData.experience;
      case "skills":
        return (
          (userData.technicalSkills?.length ||
            userData.professionalSkills?.length) > 0
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
        return userData.workExperience?.length > 0;
      case "projects":
        return userData.projects?.length > 0;
      case "certifications":
        return userData.certifications?.length > 0;
      case "contact":
        return !!(
          userData.email ||
          userData.phone ||
          userData.linkedin ||
          userData.github
        );
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
      {/* Sticky Glass Morphism Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl shadow-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <button
              onClick={scrollToTop}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
              aria-label="Back to top"
            >
              Portfolio
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-2">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScroll(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium
                    ${
                      activeSection === item.id
                        ? "bg-white/20 text-blue-400 shadow-md"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/15 backdrop-blur-md rounded-xl mt-2 p-4 border border-white/25 shadow-lg shadow-black/10">
              <div className="flex flex-col space-y-2">
                {visibleItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleScroll(item.id)}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 text-base font-medium
                      ${
                        activeSection === item.id
                          ? "text-blue-400 bg-white/20 shadow"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                    aria-current={
                      activeSection === item.id ? "page" : undefined
                    }
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Home Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-4 pt-6 pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 text-center lg:text-left">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    {userData.name}
                  </span>
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto lg:mx-0"></div>
                <p className="text-xl sm:text-2xl text-white/90 font-light">
                  {userData.headline}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 max-w-lg mx-auto lg:mx-0">
                <div className="flex space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <pre className="text-xs sm:text-sm text-blue-300 font-mono overflow-x-auto whitespace-pre">
                  <code>{`const portfolio = {${" ".repeat(12)}
${" ".repeat(12)}name: "${userData.name}",
${" ".repeat(12)}role: "${userData.headline}",
${" ".repeat(12)}status: "Active"
${" ".repeat(8)}};`}</code>
                </pre>
              </div>
              {userData.location && (
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-white/60">
                  <MapPin size={16} />
                  <span className="text-sm">{userData.location}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => handleScroll("contact")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <div className="flex items-center space-x-2">
                    <Mail size={16} />
                    <span>Get In Touch</span>
                  </div>
                </button>
                <button
                  onClick={() => handleScroll("projects")}
                  className="border-2 border-white/30 hover:border-blue-400 text-white hover:text-blue-400 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm bg-white/5 hover:bg-white/10 text-sm sm:text-base"
                >
                  <div className="flex items-center space-x-2">
                    <Code size={16} />
                    <span>View Projects</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Content - Profile */}
            <div className="flex justify-center lg:justify-end mt-2 lg:mt-0">
              <div className="relative">
                <img
                  src={
                    userData.profilePhoto ||
                    "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"
                  }
                  alt="Profile"
                  className="rounded-3xl w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-cover border-4 border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg";
                  }}
                />
                {userData.experience === "Fresher" && (
                  <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    Available for work
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-50 hidden sm:block">
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {userData.experience && (
        <section id="about" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                About Me
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
              <p className="text-lg sm:text-xl text-white/70 mt-6 max-w-3xl mx-auto">
                {userData.tagline ||
                  "I'm passionate about creating exceptional digital experiences."}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div className="relative max-w-xs mx-auto">
                <img
                  src={
                    userData.gender === "Male"
                      ? "/man.jpg"
                      : userData.gender === "Female"
                      ? "/woman.jpg"
                      : "/other.jpg"
                  }
                  alt="About Me"
                  className="rounded-3xl w-full h-auto shadow-2xl"
                />
              </div>
              <div className="space-y-6 sm:space-y-8 mt-8 lg:mt-0">
                <h3 className="text-3xl sm:text-4xl font-bold text-white">
                  Who am I?
                </h3>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                  {userData.aboutDescription}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
                  {[
                    { label: "Name", value: userData.name },
                    {
                      label: "Qualification",
                      value: userData.highestQualification || "N/A",
                    },
                    {
                      label: "Experience",
                      value: userData.experience || "N/A",
                    },
                    {
                      label: "Freelance",
                      value: userData.freelanceAvailable
                        ? "Available"
                        : "Not Available",
                    },
                    { label: "Email", value: userData.email },
                    { label: "Location", value: userData.location },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
                    >
                      <p className="text-white/60 text-xs sm:text-sm font-medium">
                        {item.label}
                      </p>
                      <p className="text-white font-semibold mt-1 text-sm sm:text-base">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {userData.education?.length > 0 && (
        <section id="education" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Education
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
              <p className="text-white/70 text-lg sm:text-xl mt-6">
                Academic journey and qualifications that shaped my expertise.
              </p>
            </div>

            {/* Filter and Render Valid Education */}
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
                    <p className="text-white/60 italic">
                      No complete education records to display.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid gap-6 sm:gap-8">
                  {validEducation.map((edu, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                            {edu.degree}
                          </h3>
                          <p className="text-blue-400 font-semibold text-sm sm:text-base">
                            {edu.field}
                          </p>
                          <p className="text-white/90 mt-1">{edu.school}</p>
                          {edu.location && (
                            <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                              📍 {edu.location}
                            </p>
                          )}
                        </div>

                        {/* Date & Grade */}
                        <div className="flex-shrink-0 text-right mt-3 sm:mt-0">
                          <p className="text-white/80 text-sm sm:text-base">
                            {new Date(edu.startDate).getFullYear()} –{" "}
                            {edu.endDate
                              ? new Date(edu.endDate).getFullYear()
                              : "Present"}
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

      {/* Skills Section */}
      {(userData.technicalSkills?.length ||
        userData.professionalSkills?.length) > 0 && (
        <section id="skills" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
              <p className="text-lg sm:text-xl text-white/70 mt-6">
                I'm constantly learning and expanding my skill set
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
              {/* Technical Skills */}
              {userData.technicalSkills?.length > 0 && (
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
                    <Code className="mr-2 sm:mr-3 text-blue-400" />
                    Technical Skills
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    {userData.technicalSkills.map((skill, idx) => (
                      <div
                        key={skill.name || idx}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {skill.name}
                          </span>
                          <span className="text-blue-400 font-bold text-sm sm:text-base">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Professional Skills */}
              {userData.professionalSkills?.length > 0 && (
                <div className="mt-8 lg:mt-0">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
                    <Users className="mr-2 sm:mr-3 text-blue-400" />
                    Professional Skills
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    {userData.professionalSkills.map((skill, idx) => (
                      <div
                        key={skill.name || idx}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {skill.name}
                          </span>
                          <span className="text-green-400 font-bold text-sm sm:text-base">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
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

      {/* Experience Section */}
      {userData.workExperience?.length > 0 && (
        <section id="experience" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Work Experience
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
              <p className="text-lg sm:text-xl text-white/70 mt-6">
                Professional journey and career milestones
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-400 to-cyan-400"></div>
              <div className="space-y-6 sm:space-y-8">
                {userData.workExperience.map((item, idx) => (
                  <div
                    key={item.company + item.role + idx}
                    className="relative"
                  >
                    <div className="absolute left-4 sm:left-6 w-3 sm:w-4 h-3 sm:h-4 bg-blue-500 rounded-full border-2 sm:border-4 border-white shadow-lg"></div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105 ml-12 sm:ml-20">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-1 sm:mb-2">
                            {item.role}
                          </h3>
                          <h4 className="text-lg sm:text-xl font-semibold text-white">
                            {item.company}
                          </h4>
                          {item.companyWebsite && (
                            <a
                              href={item.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-blue-300 hover:text-blue-200 transition-all duration-200 group"
                              aria-label="Visit company website"
                            >
                              <span>🔗</span>
                              <span>Visit Company Website</span>
                            </a>
                          )}
                        </div>
                        <span className="text-blue-400 font-semibold mt-2 sm:mt-0 bg-blue-500/20 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {userData.projects?.length > 0 && (
        <section id="projects" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
              <p className="text-lg sm:text-xl text-white/70 mt-6">
                Showcasing my best work and creative solutions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {userData.projects.map((project, idx) => (
                <div
                  key={project.title || idx}
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Code className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-sm sm:text-base transition-colors duration-300"
                      >
                        View Project
                        <ExternalLink
                          size={14}
                          className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {userData.github && (
              <div className="text-center mt-12 sm:mt-16">
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                >
                  <Github size={18} />
                  <span>View All Projects on GitHub</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {userData.certifications?.length > 0 && (
        <section id="certifications" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Certifications
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
              <p className="text-lg sm:text-xl text-white/70 mt-6">
                Recognized achievements and professional development
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {userData.certifications.map((cert, idx) => (
                <div
                  key={cert.title + cert.issuer + idx}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-2 sm:mr-3" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {cert.title}
                    </h3>
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-white/80 text-sm sm:text-base">
                    <p>
                      <span className="font-semibold">Issued by:</span>{" "}
                      {cert.issuer}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {cert.date}
                    </p>
                  </div>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 sm:mt-4 text-blue-400 hover:text-blue-300 font-semibold text-sm sm:text-base transition-colors duration-300"
                    >
                      View Certificate
                      <ExternalLink size={14} className="ml-1 sm:ml-2" />
                    </a>
                  )}
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
        userData.resume) && (
        <section id="contact" className="py-18 sm:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Get In Touch
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
              <p className="text-lg sm:text-xl text-white/70 mt-6">
                Let's discuss your next project or opportunity
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {userData.location && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Location
                    </h3>
                  </div>
                  <p className="text-white/80 text-sm sm:text-base">
                    {userData.location}
                  </p>
                </div>
              )}
              {userData.email && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Email
                    </h3>
                  </div>
                  <a
                    href={`mailto:${userData.email}`}
                    className="text-white/80 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    {userData.email}
                  </a>
                </div>
              )}
              {userData.phone && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Phone
                    </h3>
                  </div>
                  <a
                    href={`tel:${userData.phone}`}
                    className="text-white/80 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    {userData.phone}
                  </a>
                </div>
              )}
              {userData.linkedin && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      LinkedIn
                    </h3>
                  </div>
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    View Profile
                  </a>
                </div>
              )}
              {userData.github && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <Github className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      GitHub
                    </h3>
                  </div>
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    View Profile
                  </a>
                </div>
              )}
              {userData.resume && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Resume
                    </h3>
                  </div>
                  <a
                    href={userData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center text-white/80 hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base"
                  >
                    📥 Download Resume
                  </a>
                </div>
              )}
            </div>
            <div className="text-center mt-4 sm:mt-8">
              <p className="text-white/60 text-sm sm:text-base">
                I'm always open to discussing new opportunities and
                collaborations.
              </p>
            </div>
          </div>
        </section>
      )}
      <div className="text-center py-4 sm:py-6">
        <button
          onClick={scrollToTop}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label="Back to top"
        >
          <ChevronDown size={18} className="transform rotate-180" />
          <span>Back to Top</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              Made with passion by {userData.name} 💻✨
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              {userData.github && (
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-blue-400 transition-colors duration-300"
                  aria-label="GitHub Profile"
                >
                  <Github size={18} />
                </a>
              )}
              {userData.linkedin && (
                <a
                  href={userData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-blue-400 transition-colors duration-300"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinimalistPortfolio;
