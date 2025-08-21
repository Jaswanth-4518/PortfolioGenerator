import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Code,
  Book,
  Briefcase,
  Award,
  Users,
  MessageCircle,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const NeonGridPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);

    // Delay slightly to ensure conditional rendering
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Helper to safely parse year
  const parseYear = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Invalid Date" : date.getFullYear();
  };

  // Reuse education validation
  const hasValidEducation = userData?.education?.some(
    (edu) =>
      edu.school?.trim() &&
      edu.degree?.trim() &&
      edu.field?.trim() &&
      edu.startDate
  );

  const navLinks = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: Users },
    { id: "education", label: "Education", icon: Book },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Work", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code },
    { id: "certifications", label: "Badges", icon: Award },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  const shouldShowSection = (sectionId) => {
    if (!userData) return false;
    switch (sectionId) {
      case "about":
        return !!userData.experience;
      case "skills":
        return (
          userData.technicalSkills?.length > 0 ||
          userData.professionalSkills?.length > 0
        );
      case "experience":
        return userData.workExperience?.length > 0;
      case "education":
        return hasValidEducation;
      case "projects":
        return userData.projects?.length > 0;
      case "certifications":
        return userData.certifications?.length > 0;
      case "contact":
        return (
          userData.email ||
          userData.phone ||
          userData.linkedin ||
          userData.github ||
          userData.resume
        );
      default:
        return true;
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-purple-400 mt-4">Loading futuristic profile...</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-gray-400 hover:text-white transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Reusable Section Header Component
  const SectionHeader = ({ title, subtitle }) => (
    <div className="text-center mb-12 sm:mb-16 px-4">
      <h2 className="text-4xl sm:text-5xl font-black mb-4">
        <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto mb-6"></div>
      {subtitle && (
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans">
      {/* Animated Grid Background */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Floating Glowing Orbs */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-gradient-to-l from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 right-4 z-[60] lg:hidden w-12 h-12 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-500/30"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <Menu size={20} aria-hidden="true" />
        )}
      </button>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 bg-black/70 backdrop-blur-md border-r border-purple-500/30 flex-col items-center py-8 z-50">
        {navLinks.map(({ id, label, icon: Icon }) => {
          if (!shouldShowSection(id)) return null;
          return (
            <button
              key={id}
              onClick={() => handleScroll(id)}
              className={`w-12 h-12 mb-6 rounded-full flex items-center justify-center transition-all group relative ${
                activeSection === id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
                  : "text-gray-400 hover:bg-purple-500/20 hover:text-white"
              }`}
              aria-label={label}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="invisible group-hover:visible absolute left-full ml-3 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* Mobile Navigation Menu */}
      <nav
        className={`fixed top-0 left-0 w-full h-full bg-black/90 backdrop-blur-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {navLinks.map(({ id, label, icon: Icon }) => {
            if (!shouldShowSection(id)) return null;
            return (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className={`flex items-center space-x-4 text-2xl font-bold py-4 transition-colors ${
                  activeSection === id
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Icon size={24} aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-20 min-h-screen">
        {/* === HERO === */}
        <section
          id="home"
          className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight break-words">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    {userData.name}
                  </span>
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto lg:mx-0"></div>
                <p className="text-xl sm:text-2xl text-pink-300 font-light">
                  {userData.headline}
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed flex items-center justify-center lg:justify-start gap-2">
                  <MapPin size={18} className="text-pink-400 flex-shrink-0" aria-hidden="true" />
                  <span>{userData.location}</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <button
                    onClick={() => handleScroll("contact")}
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all transform hover:scale-105 duration-300"
                  >
                    Get In Touch
                  </button>
                  <button
                    onClick={() => handleScroll("projects")}
                    className="px-6 py-3 sm:px-8 sm:py-4 border border-cyan-500 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/10 hover:text-cyan-300 transition-all transform hover:scale-105 duration-300"
                  >
                    View Projects
                  </button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
                  <img
                    src={
                      userData.profilePhoto ||
                      "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border-4 border-purple-500 shadow-2xl shadow-purple-500/30"
                    onError={(e) => {
                      e.target.src =
                        "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg";
                    }}
                  />
                  {userData.experience === "Fresher" && (
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
                      <span className="block px-4 py-2 text-xs sm:text-sm font-bold rounded-full text-white relative shadow-lg animate-bounce whitespace-nowrap bg-gradient-to-r from-purple-500 to-cyan-500 border border-purple-500/50">
                        ✨ Open to Work
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full border-2 border-pink-500/50 animate-pulse delay-1000 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-40 hidden sm:block">
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* === ABOUT === */}
        {shouldShowSection("about") && (
          <section
            id="about"
            className="py-24 sm:py-32 relative px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <SectionHeader title="About Me" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    {userData.tagline}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Name", value: userData.name },
                      {
                        label: "Qualification",
                        value: userData.highestQualification || "N/A",
                      },
                      { label: "Experience", value: userData.experience },
                      {
                        label: "Freelance",
                        value: userData.freelanceAvailable
                          ? "Available"
                          : "Not Available",
                      },
                      { label: "Email", value: userData.email },
                      {
                        label: "Location",
                        value: userData.location || "Global",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-black/50 border border-purple-500/30 p-4 rounded-xl hover:border-purple-400/50 transition-all duration-300"
                      >
                        <p className="text-purple-300 text-sm font-medium">
                          {item.label}
                        </p>
                        <p className="text-white font-semibold mt-1 truncate">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:flex justify-center lg:justify-end">
                  <div className="relative group">
                    <div className="absolute -inset-4 w-72 h-72 rounded-3xl bg-gradient-to-tr from-purple-600/30 to-cyan-500/20 blur-xl opacity-70 animate-pulse"></div>
                    <div className="relative w-64 h-64 rounded-3xl overflow-hidden border-2 border-purple-500/50 bg-black/20 shadow-2xl shadow-purple-500/20 z-10">
                      <img
                        src={
                          userData.gender === "Male"
                            ? "/man.jpg"
                            : userData.gender === "Female"
                            ? "/woman.jpg"
                            : "/other.jpg"
                        }
                        alt="Profile representation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* === EDUCATION === */}
        {shouldShowSection("education") && (
          <section
            id="education"
            className="py-24 sm:py-32 relative px-4 sm:px-6 lg:px-8 overflow-hidden"
          >
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-purple-600/5 rounded-full blur-3xl absolute bottom-10 left-1/4 opacity-10"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <SectionHeader
                title="Education"
                subtitle="Academic milestones that laid the foundation of my expertise."
              />

              <div className="grid gap-8 sm:gap-10 lg:grid-cols-3">
                {userData.education
                  .filter(
                    (edu) =>
                      edu.school?.trim() &&
                      edu.degree?.trim() &&
                      edu.field?.trim() &&
                      edu.startDate
                  )
                  .map((edu, idx) => {
                    const startDate = parseYear(edu.startDate);
                    const endDate = edu.endDate ? parseYear(edu.endDate) : "Present";

                    return (
                      <div
                        key={idx}
                        className="relative bg-black/70 rounded-xl p-6 backdrop-blur-sm overflow-hidden"
                        style={{
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                          backgroundClip: "padding-box",
                          boxShadow: `
                            0 0 8px rgba(139, 92, 246, 0.3),
                            0 0 15px rgba(139, 92, 246, 0.2)
                          `,
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{
                            border: "1px solid rgba(139, 92, 246, 0.6)",
                            background:
                              "linear-gradient(45deg, #8B5CF6, #06B6D4, #8B5CF6)",
                            backgroundClip: "border-box",
                            WebkitMask:
                              "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%) content-box, linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
                            WebkitMaskComposite: "destination-out",
                            maskComposite: "exclude",
                            padding: "1px",
                          }}
                        ></div>

                        <div className="relative z-10">
                          <h3 className="text-xl font-bold text-white">
                            {edu.degree}
                          </h3>
                          <p className="text-cyan-400 font-semibold text-sm mt-1">
                            {edu.field}
                          </p>
                          <p className="text-white/90 mt-3 font-medium">
                            {edu.school}
                          </p>

                          {edu.location && (
                            <p className="text-white/70 text-sm mt-2 flex items-center gap-1.5">
                              <MapPin size={14} className="text-pink-400" aria-hidden="true" />
                              <span>{edu.location}</span>
                            </p>
                          )}

                          <div className="mt-6 pt-4 border-t border-purple-500/20 flex justify-between">
                            <span className="text-purple-300 text-sm font-medium">
                              {startDate} – {endDate}
                            </span>
                            {edu.grade && (
                              <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shadow-green-500/30">
                                GPA: {edu.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )}

        {/* === SKILLS === */}
        {shouldShowSection("skills") && (
          <section
            id="skills"
            className="py-24 sm:py-32 relative px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                title="Skills & Expertise"
                subtitle="I'm constantly learning and expanding my skill set."
              />

              <div className="grid md:grid-cols-2 gap-10">
                {userData.technicalSkills?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                        <Code className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      Technical Skills
                    </h3>
                    <div className="space-y-6">
                      {userData.technicalSkills.map((s) => (
                        <div key={s.name}>
                          <div className="flex justify-between mb-2">
                            <span className="text-white font-semibold">
                              {s.name}
                            </span>
                            <span className="text-purple-400 font-bold">
                              {s.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                              style={{ width: `${s.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userData.professionalSkills?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                        <Users className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      Soft Skills
                    </h3>
                    <div className="space-y-6">
                      {userData.professionalSkills.map((s) => (
                        <div key={s.name}>
                          <div className="flex justify-between mb-2">
                            <span className="text-white font-semibold">
                              {s.name}
                            </span>
                            <span className="text-cyan-400 font-bold">
                              {s.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full"
                              style={{ width: `${s.level}%` }}
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
        {shouldShowSection("experience") && (
          <section
            id="experience"
            className="py-24 sm:py-32 relative px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                title="Work Experience"
                subtitle="Professional journey and impactful roles."
              />

              <div className="space-y-8">
                {userData.workExperience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-black/90 border border-purple-500/40 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div className="w-full sm:w-3/4 mb-4 sm:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                            {exp.role}
                          </h3>
                          <span className="text-white/70 text-sm hidden sm:inline">
                            at
                          </span>
                          <h4 className="text-lg sm:text-xl text-white font-semibold">
                            {exp.company}
                          </h4>
                        </div>
                        <p className="text-gray-300 mt-3 text-sm sm:text-base">
                          {exp.description}
                        </p>
                        {exp.companyWebsite && (
                          <a
                            href={exp.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 text-sm mt-2 inline-flex items-center hover:underline"
                          >
                            Visit Company{" "}
                            <ExternalLink size={12} className="ml-1" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* === PROJECTS === */}
        {shouldShowSection("projects") && (
          <section
            id="projects"
            className="py-24 sm:py-32 relative px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                title="Featured Projects"
                subtitle="Showcasing my best work and innovative solutions."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {userData.projects.map((p, idx) => (
                  <div
                    key={idx}
                    className="group bg-black/70 border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/60 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    <div className="h-36 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center border-b border-gray-700">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition duration-500">
                        <Code className="w-8 h-8 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition">
                        {p.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 h-20 overflow-hidden text-ellipsis">
                        {p.description}
                      </p>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-400 text-sm font-semibold hover:text-cyan-400 transition"
                        >
                          View Project{" "}
                          <ExternalLink
                            size={14}
                            className="ml-1.5 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
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
                    className="inline-flex items-center space-x-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <Github size={18} aria-hidden="true" />
                    <span>Explore on GitHub</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* === CERTIFICATIONS === */}
        {shouldShowSection("certifications") && (
          <section
            id="certifications"
            className="py-24 sm:py-32 relative px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                title="Certifications"
                subtitle="Recognized achievements and professional development."
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userData.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="group bg-black/70 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/60 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:rotate-6 transition duration-300">
                      <Award className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                      {cert.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-1">
                      <span className="text-purple-400 font-medium">
                        Issuer:
                      </span>{" "}
                      {cert.issuer}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <span className="text-pink-400 font-medium">Date:</span>{" "}
                      {cert.date}
                    </p>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                      >
                        View Certificate{" "}
                        <ExternalLink size={14} className="ml-1.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* === CONTACT === */}
        {shouldShowSection("contact") && (
          <section
            id="contact"
            className="py-24 sm:py-32 relative overflow-hidden px-4 sm:px-6 lg:px-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-cyan-900/10 -skew-y-3"></div>
            <div className="max-w-4xl mx-auto relative z-10">
              <SectionHeader
                title="Get In Touch"
                subtitle="Let’s build something amazing together."
              />

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    type: "email",
                    value: userData.email,
                    href: `mailto:${userData.email}`,
                    icon: Mail,
                    color: "purple",
                  },
                  {
                    type: "phone",
                    value: userData.phone,
                    href: `tel:${userData.phone}`,
                    icon: Phone,
                    color: "cyan",
                  },
                  {
                    type: "location",
                    value: userData.location,
                    icon: MapPin,
                    color: "gray",
                  },
                  {
                    type: "linkedin",
                    value: "LinkedIn Profile",
                    href: userData.linkedin,
                    icon: Linkedin,
                    color: "blue",
                  },
                  {
                    type: "github",
                    value: "GitHub Profile",
                    href: userData.github,
                    icon: Github,
                    color: "gray",
                  },
                  {
                    type: "resume",
                    value: "Download Resume",
                    href: userData.resume,
                    icon: Code,
                    download: true,
                    color: "green",
                  },
                ].map((item) => {
                  if (!item.value) return null;
                  const Icon = item.icon;
                  const linkClasses = `group flex items-center space-x-3 p-4 bg-white/5 backdrop-blur-sm border border-${item.color}-500/40 rounded-xl hover:bg-${item.color}-500/10 hover:border-${item.color}-400/60 transition-all duration-300 transform hover:scale-105`;
                  const iconContainerClasses = `flex-shrink-0 w-10 h-10 bg-${item.color}-500/20 rounded-full flex items-center justify-center text-${item.color}-400 group-hover:bg-${item.color}-500/40 group-hover:text-${item.color}-300 transition`;

                  const content = (
                    <>
                      <div className={iconContainerClasses}>
                        <Icon size={18} aria-hidden="true" />
                      </div>
                      <span
                        className={`text-white group-hover:text-${item.color}-300 transition truncate`}
                      >
                        {item.value}
                      </span>
                    </>
                  );

                  if (item.href) {
                    return (
                      <a
                        key={item.type}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={item.download}
                        className={linkClasses}
                      >
                        {content}
                      </a>
                    );
                  }
                  return (
                    <div key={item.type} className={linkClasses}>
                      {content}
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => handleScroll("home")}
                  className="inline-flex items-center space-x-2 px-6 py-3 text-purple-400 hover:text-white border border-purple-500/40 rounded-lg hover:bg-purple-600/20 transition"
                >
                  <ChevronDown className="h-5 w-5 rotate-180" aria-hidden="true" />
                  <span>Back to Top</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="lg:ml-20 border-t border-purple-500/20 py-6 text-center text-sm text-gray-500 px-4 sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {userData.name}.Turning ideas into reality — one line of code at a time 💡
        </p>
      </footer>
    </div>
  );
};

export default NeonGridPortfolio;