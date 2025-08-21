import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  X,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Code2,
  Building,
  Trophy,
  User,
  Send,
  Download,
  Star,
  Zap,
  Target,
  Layers,
  GraduationCap,
  Briefcase,
  Globe,
  BookOpen,
  ChevronUp,
} from "lucide-react";

const ClassicPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // All section refs including certifications
  const sectionRefs = {
    hero: useRef(null),
    about: useRef(null),
    education: useRef(null),
    skills: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
    certifications: useRef(null),
  };

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

  // Throttled scroll tracking
  useEffect(() => {
    const throttle = (fn, delay) => {
      let inProgress = false;
      return () => {
        if (inProgress) return;
        inProgress = true;
        fn.apply(this, arguments);
        setTimeout(() => (inProgress = false), delay);
      };
    };

    const handleScroll = throttle(() => setScrollY(window.scrollY), 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking with dynamic ref observation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" }
    );

    const observedElements = [];
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
        observedElements.push(ref.current);
      }
    });

    return () => {
      observedElements.forEach((el) => observer.unobserve(el));
    };
  }, [userData]);

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper: Parse year safely
  const parseYear = (dateStr) => {
    if (!dateStr) return "Unknown";
    const year = new Date(dateStr).getFullYear();
    return isNaN(year) ? "Unknown" : year;
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-lg font-medium">
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "hero", label: "Home", icon: Target },
    { id: "about", label: "About", icon: User, show: userData.experience },
    {
      id: "education",
      label: "Education",
      icon: BookOpen,
      show: (userData.education?.length ?? 0) > 0,
    },
    {
      id: "skills",
      label: "Skills",
      icon: Zap,
      show:
        (userData.technicalSkills?.length ?? 0) > 0 ||
        (userData.professionalSkills?.length ?? 0) > 0,
    },
    {
      id: "experience",
      label: "Experience",
      icon: Building,
      show: (userData.workExperience?.length ?? 0) > 0,
    },
    {
      id: "projects",
      label: "Projects",
      icon: Layers,
      show: (userData.projects?.length ?? 0) > 0,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Trophy,
      show: (userData.certifications?.length ?? 0) > 0,
    },
    {
      id: "contact",
      label: "Contact",
      icon: Send,
      show:
        userData.email ||
        userData.phone ||
        userData.linkedin ||
        userData.github,
    },
  ].filter((item) => item.show !== false);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-gray-800/95 backdrop-blur-md shadow-lg border-b border-gray-600"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Portfolio
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === id
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-blue-600/20 border border-blue-500/30"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden mt-2 p-4 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600"
            >
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === id
                      ? "bg-blue-600/30 text-blue-300"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={sectionRefs.hero}
        className="py-24 px-6 sm:px-8 lg:px-12 max-w-3xl mx-auto text-center relative"
      >
        <div className="flex justify-center mb-8">
          <div className="relative inline-block">
            <img
              src={
                userData.profilePhoto ||
                "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"
              }
              alt="Profile"
              className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 object-cover rounded-full border-4 border-gray-700 bg-gray-800 shadow-lg"
              onError={(e) => {
                e.target.src =
                  "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg";
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-gray-900 text-xs px-2 py-1 text-gray-300 border border-gray-600 rounded shadow-sm">
              {userData.experience}
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
          {userData.name}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 font-medium mb-3">
          {userData.headline}
        </p>

        {userData.location && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
            <MapPin size={14} className="text-gray-500" />
            <span>{userData.location}</span>
          </div>
        )}

        <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-7"></div>

        <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 px-2 sm:px-6">
          {userData.tagline ||
            "Passionate technologist focused on clean code, thoughtful design, and meaningful impact."}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm sm:text-base">
          <button
            onClick={() => scrollToSection("contact")}
            className="px-6 py-2.5 border border-gray-500 text-gray-200 bg-gray-800/60 rounded-lg hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm font-medium"
          >
            Get In Touch
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-500 hover:to-emerald-500 transition-all duration-200 font-medium shadow-sm"
          >
            View Projects
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
          <button
            onClick={() => scrollToSection("about")}
            className="group focus:outline-none"
            aria-label="Scroll to next section"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200 animate-bounce"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* About Section */}
      {userData.experience && (
        <section
          id="about"
          ref={sectionRefs.about}
          className="py-32 px-6 sm:px-8 lg:px-12 min-h-screen flex items-center"
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-x-4 items-center">
              <div className="relative flex justify-center lg:justify-start order-last sm:order-none">
                <div className="relative group">
                  <img
                    src={
                      userData.gender === "Male"
                        ? "/man.jpg"
                        : userData.gender === "Female"
                        ? "/woman.jpg"
                        : "/other.jpg"
                    }
                    alt="Profile"
                    className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-blue-400/30 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 transform group-hover:scale-105"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm shadow-lg transform rotate-6 group-hover:rotate-3 transition-transform duration-300">
                    {userData.experience}
                  </div>
                </div>
              </div>
              <div className="space-y-8 text-center lg:text-left">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-emerald-200 to-cyan-200 leading-tight tracking-tight">
                  About Me
                </h2>
                <div className="space-y-5 mt-8">
                  {[
                    { icon: User, label: "Name", value: userData.name },
                    {
                      icon: GraduationCap,
                      label: "Highest Qualification",
                      value: userData.highestQualification || "Not specified",
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      value: userData.email || "Not provided",
                      link: userData.email ? `mailto:${userData.email}` : null,
                    },
                    {
                      icon: MapPin,
                      label: "Location",
                      value: userData.location || "Remote",
                    },
                    {
                      icon: Briefcase,
                      label: "Freelance",
                      value: userData.freelanceAvailable
                        ? "Available"
                        : "Unavailable",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 group">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:from-blue-400 group-hover:to-teal-400 group-hover:scale-110 transition-all duration-300">
                        <item.icon size={18} strokeWidth={1.5} />
                      </div>

                      {/* Label */}
                      <span className="text-gray-200 font-semibold text-sm sm:text-base min-w-max">
                        {item.label}
                      </span>

                      {/* Dashed line (flexible) */}
                      <div className="flex-1 border-t border-gray-700 border-dashed opacity-60"></div>

                      {/* Value - Right Aligned */}
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-blue-300 hover:text-emerald-300 text-sm sm:text-base font-medium transition-colors duration-200 underline decoration-dotted decoration-1 hover:decoration-solid text-right"
                          title="Send email"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-gray-300 text-sm sm:text-base font-medium text-right">
                          {item.value}
                        </span>
                      )}
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
        <section
          id="education"
          ref={sectionRefs.education}
          className="py-28 px-6 sm:px-8 lg:px-12 scroll-mt-20"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Education
                </span>
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
                Academic milestones that shaped my foundation.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/30 via-emerald-500/30 to-cyan-500/30 transform -translate-x-0.5"></div>

              {userData.education
                .filter(
                  (edu) =>
                    edu.school?.trim() &&
                    edu.degree?.trim() &&
                    edu.field?.trim() &&
                    edu.startDate
                )
                .map((edu, idx) => (
                  <div key={idx} className="relative flex items-center mb-16">
                    <div className="flex-1 pr-8 text-right">
                      <h4 className="text-xl font-bold text-blue-300">
                        {edu.school}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {edu.location || "Unknown"}
                      </p>
                    </div>

                    <div className="relative z-10 w-4 h-4 bg-white rounded-full border-4 border-blue-500 shadow-lg"></div>

                    <div className="flex-1 pl-8">
                      <h3 className="text-xl font-bold text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-emerald-400 font-medium">
                        {edu.field}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {parseYear(edu.startDate)} –{" "}
                        {edu.endDate ? parseYear(edu.endDate) : "Present"}
                      </p>
                      {edu.grade && (
                        <p className="text-blue-300 text-sm mt-1">
                          <span className="font-medium">GPA:</span> {edu.grade}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {(userData.technicalSkills?.length ?? 0) > 0 ||
      (userData.professionalSkills?.length ?? 0) > 0 ? (
        <section
          id="skills"
          ref={sectionRefs.skills}
          className="py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Skills & Expertise
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-emerald-400/30"></span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                The tools, technologies, and soft skills I use to build
                impactful digital experiences.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
              {userData.technicalSkills?.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-xl border border-blue-500/40 backdrop-blur-sm shadow-lg">
                      <Code2 className="text-blue-300" size={24} />
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Technical Skills
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {userData.technicalSkills.map((skill, idx) => (
                      <div
                        key={skill.name || idx}
                        className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-500"
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-white font-semibold text-lg">
                            {skill.name}
                          </span>
                        </div>
                        <div className="flex space-x-1.5 mb-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                                i < Math.round(skill.level / 10)
                                  ? "bg-blue-400 shadow-sm shadow-blue-400/50 scale-110"
                                  : "bg-slate-700 group-hover:bg-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium text-blue-300">
                          Level {Math.round(skill.level / 10)} / 10
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {userData.professionalSkills?.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-600/30 to-teal-800/30 rounded-xl border border-emerald-500/40 backdrop-blur-sm shadow-lg">
                      <User className="text-emerald-300" size={24} />
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Professional Skills
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {userData.professionalSkills.map((skill, idx) => (
                      <div
                        key={skill.name || idx}
                        className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 hover:border-emerald-500/50 transition-all duration-500"
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-white font-semibold text-lg">
                            {skill.name}
                          </span>
                        </div>
                        <div className="flex space-x-1.5 mb-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                                i < Math.round(skill.level / 10)
                                  ? "bg-emerald-400 shadow-sm shadow-emerald-400/50 scale-110"
                                  : "bg-slate-700 group-hover:bg-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium text-emerald-300">
                          Level {Math.round(skill.level / 10)} / 10
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Experience Section */}
      {userData.workExperience?.length > 0 && (
        <section
          id="experience"
          ref={sectionRefs.experience}
          className="py-28 px-6 sm:px-8 lg:px-12"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Professional Experience
                </span>
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
                Roles and responsibilities that defined my career path.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/40 to-emerald-500/40 transform -translate-x-0.5"></div>

              <div className="space-y-10">
                {userData.workExperience.map((exp, idx) => (
                  <div key={idx} className="relative flex items-start gap-6">
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Building size={24} className="text-white" />
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex-1 hover:border-blue-500/50 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white">
                        {exp.role}
                      </h3>
                      <p className="text-blue-400 font-semibold">
                        {exp.company}
                      </p>
                      <p className="text-gray-300 text-sm mb-2">
                        {exp.duration}
                      </p>
                      <p className="text-gray-400 leading-relaxed mb-3">
                        {exp.description}
                      </p>
                      {exp.companyWebsite && (
                        <a
                          href={exp.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          <Globe size={14} />
                          <span>Visit Website</span>
                        </a>
                      )}
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
        <section
          id="projects"
          ref={sectionRefs.projects}
          className="py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                A showcase of my recent work and creative solutions
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {userData.projects.map((project, idx) => (
                <div
                  key={project.title || idx}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-600/30 to-emerald-600/30 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-emerald-900/50"></div>
                    <Layers
                      className="text-blue-400 z-10 group-hover:scale-110 transition-transform duration-300"
                      size={48}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                      >
                        <span>View Project</span>
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
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
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-blue-500 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-emerald-600/10 transition-all duration-300"
                >
                  <Github size={20} />
                  <span>Explore More Projects</span>
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {userData.certifications?.length > 0 && (
        <section
          id="certifications"
          ref={sectionRefs.certifications}
          className="py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Certifications
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Professional certifications and achievements
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {userData.certifications.map((cert, idx) => (
                <div
                  key={cert.title || idx}
                  className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 border border-blue-500/20 rounded-2xl p-6 text-center hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-white" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-blue-400 font-medium mb-1">
                    by {cert.issuer}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">{cert.date}</p>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink size={14} />
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
        userData.location ||
        userData.linkedin ||
        userData.github ||
        userData.resume) && (
        <section
          id="contact"
          ref={sectionRefs.contact}
          className="w-full min-h-screen flex items-center justify-center px-6 py-16 sm:py-20 lg:py-10 bg-gray-800"
        >
          <div className="container mx-auto max-w-6xl w-full px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Let's Connect
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                  Open to projects, collaborations, or a quick chat about tech &
                  design.
                </p>
                {userData.resume && (
                  <div className="flex justify-center lg:justify-start">
                    <a
                      href={userData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-7 py-3 sm:px-8 sm:py-4 bg-black text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    >
                      <Download size={20} />
                      <span>Download Resume</span>
                    </a>
                  </div>
                )}
              </div>
              <div className="space-y-6 sm:space-y-8 mt-6 lg:mt-0">
                {userData.email && (
                  <div className="flex items-center space-x-5 sm:space-x-6">
                    <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg flex-shrink-0">
                      <Mail size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg">Email</p>
                      <a
                        href={`mailto:${userData.email}`}
                        className="text-blue-300 hover:text-emerald-300 text-sm sm:text-lg block transition duration-150"
                      >
                        {userData.email}
                      </a>
                    </div>
                  </div>
                )}
                {userData.phone && (
                  <div className="flex items-center space-x-5 sm:space-x-6">
                    <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg flex-shrink-0">
                      <Phone size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg">Phone</p>
                      <a
                        href={`tel:${userData.phone}`}
                        className="text-blue-300 hover:text-emerald-300 text-sm sm:text-lg block transition duration-150"
                      >
                        {userData.phone}
                      </a>
                    </div>
                  </div>
                )}
                {userData.location && (
                  <div className="flex items-center space-x-5 sm:space-x-6">
                    <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg flex-shrink-0">
                      <MapPin size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg">Location</p>
                      <p className="text-gray-300 text-sm sm:text-lg">
                        {userData.location}
                      </p>
                    </div>
                  </div>
                )}
                {userData.github && (
                  <div className="flex items-center space-x-5 sm:space-x-6">
                    <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg flex-shrink-0">
                      <Github size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg">GitHub</p>
                      <a
                        href={userData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-emerald-300 text-sm sm:text-lg block transition duration-150"
                      >
                        View repositories
                      </a>
                    </div>
                  </div>
                )}
                {userData.linkedin && (
                  <div className="flex items-center space-x-5 sm:space-x-6">
                    <div className="bg-white p-3 sm:p-4 rounded-full shadow-lg flex-shrink-0">
                      <Linkedin size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg">LinkedIn</p>
                      <a
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-emerald-300 text-sm sm:text-lg block transition duration-150"
                      >
                        Connect professionally
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-12 sm:mt-16">
              <p className="text-base sm:text-lg text-gray-400 italic">
                Looking forward to hearing from you! 📧
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Back to Top Button */}
      <div className="relative py-3 bg-gray-800">
        <div className="container mx-auto text-center">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Back to top"
          >
            <ChevronUp size={20} />
            <span>Back to Top</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-3">
               A journey of learning, building, and growing — by {userData.name}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClassicPortfolio;
