import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Home,
  User,
  GraduationCap,
  Code,
  Briefcase,
  FolderKanban,
  Award,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  ChevronUp,
  MapPin,
  FileText,
  Calendar,
  ChevronDown,
} from "lucide-react";

const VibrantPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Refs for sections
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const certificationsRef = useRef(null);
  const contactRef = useRef(null);

  const sectionRefs = {
    hero: heroRef,
    about: aboutRef,
    education: educationRef,
    skills: skillsRef,
    experience: experienceRef,
    projects: projectsRef,
    certifications: certificationsRef,
    contact: contactRef,
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
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching portfolio:", err);
        setUserData({});
        setLoaded(true);
      });
  }, [id]);

  // ✅ SCROLL SPY: Observe sections only when loaded and DOM is ready
  useEffect(() => {
    if (!loaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0]);
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "-100px 0px -100px 0px",
      }
    );

    const observeSections = () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });
    };

    const timeoutId = setTimeout(observeSections, 100); // Small delay to ensure render

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loaded, sectionRefs]);

  // ✅ Scroll to section and update active state
  const scrollToSection = (ref, sectionId) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("hero");
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  // ✅ Consistent logic: only show education if school & degree exist
  const hasEducation = userData.education?.some(
    (edu) => edu.school && edu.degree
  );

  const hasSkills =
    (userData.technicalSkills?.length || userData.professionalSkills?.length) > 0;

  const hasCertifications =
    Array.isArray(userData.certifications) && userData.certifications.length > 0;

  const hasContact = !!(
    userData.email ||
    userData.phone ||
    userData.linkedin ||
    userData.github ||
    userData.resume
  );

  const navItems = [
    { id: "hero", label: "Home", icon: Home, color: "from-blue-400 to-cyan-300" },
    { id: "about", label: "About", icon: User, color: "from-purple-400 to-pink-300" },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      color: "from-green-400 to-teal-300",
    },
    {
      id: "skills",
      label: "Skills",
      icon: Code,
      color: "from-orange-400 to-red-300",
    },
    {
      id: "experience",
      label: "Experience",
      icon: Briefcase,
      color: "from-indigo-400 to-purple-300",
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
      color: "from-yellow-400 to-orange-300",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
      color: "from-pink-400 to-rose-400",
    },
    {
      id: "contact",
      label: "Contact",
      icon: Mail,
      color: "from-cyan-400 to-blue-300",
    },
  ];

  const visibleItems = navItems.filter((item) => {
    switch (item.id) {
      case "about":
        return !!userData.tagline;
      case "education":
        return hasEducation;
      case "skills":
        return hasSkills;
      case "experience":
        return userData.workExperience?.length > 0;
      case "projects":
        return userData.projects?.length > 0;
      case "certifications":
        return hasCertifications;
      case "contact":
        return hasContact;
      default:
        return true;
    }
  });

  

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Animated Nebula Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(circle at center, #1e293b 0%, #0f172a 70%)",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
      `,
            backgroundSize: "50px 50px",
            filter: "blur(0.5px)",
          }}
        ></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${8 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/60 border-b border-purple-500/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={scrollToTop}
              className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-teal-300 bg-clip-text text-transparent hover:scale-110 transition-transform tracking-wide"
              aria-label="Go to home"
            >
              Portfolio
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-6">
              {visibleItems.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(sectionRefs[id], id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                    activeSection === id
                      ? "text-white bg-gradient-to-r " + color + " shadow-md"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r ${color} transition-all duration-300 group-hover:w-3/4`}
                  ></span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <ChevronDown
                size={22}
                className={`transition-transform duration-300 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${
              isMenuOpen ? "max-h-fit opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 p-4 bg-black/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-xl">
              {visibleItems.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(sectionRefs[id], id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === id
                      ? `text-white bg-gradient-to-r ${color} shadow-md`
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* === Hero Section === */}
      <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center px-6 sm:px-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 max-w-7xl w-full z-20 animate-fadeIn">
          {/* Left: Profile */}
          <div className="relative flex-shrink-0">
            <div className="absolute top-10 inset-0 w-full h-full rounded-full bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 animate-spin-slow p-[6px]">
              <div className="w-full h-full rounded-full bg-slate-900"></div>
            </div>
            <img
              src={
                userData.profilePhoto ||
                "https://via.placeholder.com/350/1e293b/ffffff?text=Me"
              }
              alt="Profile"
              className="relative top-10 w-48 sm:w-64 md:w-80 object-cover rounded-full shadow-2xl border-4 border-slate-900"
            />
            {userData.experience === "Fresher" && (
              <span className="absolute left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm sm:text-base md:text-lg font-semibold px-8 py-2 rounded-full shadow-md animate-blink whitespace-nowrap">
                OPEN TO WORK
              </span>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight animate-slideUp">
              {userData.name || "Your Name"}
            </h1>
            <p className="mt-4 text-2xl sm:text-3xl md:text-4xl text-teal-400 font-semibold animate-slideUp delay-150">
              {userData.headline || "Full Stack Developer"}
            </p>
            <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed animate-slideUp delay-300 mx-auto md:mx-0">
              {userData.tagline ||
                "Creating scalable and modern applications with passion for clean code and design."}
            </p>

            <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start animate-slideUp delay-500">
              <button
                onClick={() => scrollToSection(projectsRef, "projects")}
                className="px-6 py-3 flex items-center gap-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-semibold text-sm sm:text-base shadow-lg transition cursor-pointer"
              >
                🚀 View Projects
              </button>
              <button
                onClick={() => scrollToSection(contactRef, "contact")}
                className="px-6 py-3 flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold text-sm sm:text-base shadow-lg border border-slate-600 transition cursor-pointer"
              >
                ✉️ Contact Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-18">
        {/* About */}
        {[
          userData.name,
          userData.email,
          userData.phone,
          userData.location,
          userData.experience,
          userData.highestQualification,
        ].some(Boolean) && (
          <section ref={aboutRef} id="about" className="py-32">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-center mb-28 relative inline-block mx-auto">
                About Me
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full"></span>
              </h2>
              <div className="relative bg-gray-900/80 border border-gray-700 rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto pt-28 overflow-visible">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-400/60 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-3xl sm:text-4xl text-white shadow-xl">
                    {userData.gender?.toLowerCase() === "male"
                      ? "👨"
                      : userData.gender?.toLowerCase() === "female"
                      ? "👩"
                      : "👤"}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { label: "NAME", value: userData.name, icon: "📝" },
                    { label: "EMAIL", value: userData.email, icon: "✉️" },
                    { label: "PHONE", value: userData.phone, icon: "📞" },
                    { label: "LOCATION", value: userData.location, icon: "📍" },
                    {
                      label: "EXPERIENCE",
                      value: userData.experience || "N/A",
                      icon: "💼",
                    },
                    {
                      label: "EDUCATION",
                      value: userData.highestQualification || "N/A",
                      icon: "🎓",
                    },
                  ].map(
                    (item, i) =>
                      item.value && (
                        <div
                          key={i}
                          className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700/90 border border-gray-600 hover:border-purple-400/60 hover:shadow-lg transition-all flex items-center gap-3 sm:gap-4"
                        >
                          <span className="text-lg sm:text-xl">{item.icon}</span>
                          <div className="text-left flex-1 min-w-0">
                            <h3 className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                              {item.label}
                            </h3>
                            <p className="text-white mt-1 break-words text-sm sm:text-base">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Education */}
        {hasEducation && (
          <section ref={educationRef} id="education" className="py-24 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 text-center mb-16 relative inline-block mx-auto">
                Education
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 rounded-full"></span>
              </h2>
              <div className="relative flex flex-col md:flex-row md:justify-between items-center md:space-x-8">
                <div className="absolute hidden md:block top-1/2 left-0 w-full h-1 bg-gray-700"></div>
                {userData.education
                  .filter((edu) => edu.school && edu.degree)
                  .map((edu, idx) => (
                    <div
                      key={idx}
                      className="relative z-10 flex-1 max-w-sm mb-12 md:mb-0 text-center"
                    >
                      <div className="w-6 h-6 mx-auto mb-6 rounded-full border-2 border-teal-400 bg-gray-900 shadow-md"></div>
                      <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-teal-400/60 transition-all shadow-lg h-64 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                        <p className="text-teal-300 font-medium">{edu.field}</p>
                        <p className="text-gray-300">{edu.school}</p>
                        <div className="mt-3 space-y-1 text-sm text-gray-400">
                          <p>
                            {new Date(edu.startDate).getFullYear()} –{" "}
                            {edu.endDate
                              ? new Date(edu.endDate).getFullYear()
                              : "Present"}
                          </p>
                          {edu.location && <p>📍 {edu.location}</p>}
                          {edu.grade && <p>🎓 GPA: {edu.grade}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills */}
        {hasSkills && (
          <section ref={skillsRef} id="skills" className="py-32">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-center mb-16 relative inline-block mx-auto">
                Skills
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full"></span>
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                {userData.technicalSkills?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-orange-300 mb-10 text-center">
                      Technical Skills
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userData.technicalSkills.map((skill, i) => {
                        const angle = (skill.level / 100) * 180;
                        const gradientId = `grad-tech-${i}`;
                        return (
                          <div
                            key={i}
                            className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-orange-500/50 transition-all"
                          >
                            <div className="relative w-28 h-14">
                              <svg viewBox="0 0 200 100" className="w-full h-full">
                                <defs>
                                  <linearGradient
                                    id={gradientId}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                  >
                                    <stop offset="0%" stopColor="#f97316" />
                                    <stop offset="100%" stopColor="#ef4444" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M10 100 A90 90 0 0 1 190 100"
                                  fill="none"
                                  stroke="gray"
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M10 100 A90 90 0 0 1 190 100"
                                  fill="none"
                                  stroke={`url(#${gradientId})`}
                                  strokeWidth="12"
                                  strokeDasharray={`${(skill.level / 100) * 283} 283`}
                                  strokeLinecap="round"
                                />
                                <line
                                  x1="100"
                                  y1="100"
                                  x2={
                                    100 +
                                    65 *
                                      Math.cos(Math.PI - (angle * Math.PI) / 180)
                                  }
                                  y2={
                                    100 - 65 * Math.sin((angle * Math.PI) / 180)
                                  }
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="3"
                                  fill="white"
                                  className="transform -translate-y-1/2"
                                />
                              </svg>
                            </div>
                            <p className="text-white font-medium mt-3 text-sm">{skill.name}</p>
                            <span className="text-gray-300 text-xs">{skill.level}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {userData.professionalSkills?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-300 mb-10 text-center">
                      Professional Skills
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userData.professionalSkills.map((skill, i) => {
                        const angle = (skill.level / 100) * 180;
                        const gradientId = `grad-prof-${i}`;
                        return (
                          <div
                            key={i}
                            className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-blue-500/50 transition-all"
                          >
                            <div className="relative w-28 h-14">
                              <svg viewBox="0 0 200 100" className="w-full h-full">
                                <defs>
                                  <linearGradient
                                    id={gradientId}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                  >
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#9333ea" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M10 100 A90 90 0 0 1 190 100"
                                  fill="none"
                                  stroke="gray"
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M10 100 A90 90 0 0 1 190 100"
                                  fill="none"
                                  stroke={`url(#${gradientId})`}
                                  strokeWidth="12"
                                  strokeDasharray={`${(skill.level / 100) * 283} 283`}
                                  strokeLinecap="round"
                                />
                                <line
                                  x1="100"
                                  y1="100"
                                  x2={
                                    100 +
                                    65 *
                                      Math.cos(Math.PI - (angle * Math.PI) / 180)
                                  }
                                  y2={
                                    100 - 65 * Math.sin((angle * Math.PI) / 180)
                                  }
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="3"
                                  fill="white"
                                  className="transform -translate-y-1/2"
                                />
                              </svg>
                            </div>
                            <p className="text-white font-medium mt-3 text-sm">{skill.name}</p>
                            <span className="text-gray-300 text-xs">{skill.level}%</span>
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

        {/* Experience */}
        {userData.workExperience?.length > 0 && (
          <section ref={experienceRef} id="experience" className="py-32">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-center mb-16 relative inline-block mx-auto">
                Experience
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full"></span>
              </h2>
              <div className="grid md:grid-cols-3 gap-8 items-stretch">
                {userData.workExperience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden shadow-lg bg-gray-900 border border-gray-700 hover:shadow-cyan-500/30 transition-all h-full flex flex-col min-h-[240px]"
                  >
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 flex items-center justify-between">
                      <p className="text-white font-semibold text-base">{exp.company}</p>
                      {exp.companyWebsite && (
                        <a
                          href={exp.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-white/90 hover:text-white"
                          aria-label="Visit company website"
                        >
                          Website
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                        <span className="text-xs text-gray-400">{exp.duration}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed flex-1">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {userData.projects?.length > 0 && (
          <section ref={projectsRef} id="projects" className="py-24">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-center mb-16 relative inline-block mx-auto">
                My Projects
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 rounded-full"></span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {userData.projects.map((p, idx) => (
                  <a
                    key={idx}
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-3xl shadow-2xl hover:shadow-purple-600 transition-transform transform hover:-translate-y-3 hover:scale-105 duration-300"
                    aria-label={`View project: ${p.title}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 skew-y-6 -translate-y-12 group-hover:translate-y-0 group-hover:skew-y-0 transition-all duration-500 opacity-80"></div>
                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                        {p.title}
                      </h3>
                      <p className="text-gray-200 line-clamp-4 mb-4">{p.description}</p>
                      {p.techStack && p.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {p.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 group-hover:bg-yellow-400/20 group-hover:text-yellow-300 transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto inline-flex items-center text-yellow-400 font-semibold group-hover:text-yellow-300 transition-colors duration-300">
                        View Project <ExternalLink size={14} className="ml-1" />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-yellow-400/50 pointer-events-none transition-all duration-300 shadow-[0_0_20px_rgba(255,200,0,0.5)] group-hover:shadow-yellow-500/50"></div>
                  </a>
                ))}
              </div>
              {userData.github && (
                <div className="mt-16">
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold text-lg rounded-full shadow-lg hover:from-gray-700 hover:to-gray-800 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    aria-label="View more projects on GitHub"
                  >
                    <Github size={20} className="mr-2" />
                    View More Projects on GitHub
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <section ref={certificationsRef} id="certifications" className="py-32">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-center mb-16 relative inline-block mx-auto">
                Certifications
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full"></span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {userData.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl blur-xl"></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                      <p className="text-gray-300 text-sm mb-2">
                        Issued by: <span className="font-medium">{cert.issuer}</span>
                      </p>
                      <p className="text-gray-400 flex items-center gap-2 text-xs mb-4">
                        <Calendar size={14} /> {cert.date}
                      </p>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 font-semibold text-sm rounded-full transition-colors"
                        >
                          View Certificate <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact */}
        {hasContact && (
          <section ref={contactRef} id="contact" className="py-24">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-center mb-16 relative inline-block mx-auto">
                Contact Me
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full"></span>
              </h2>
              <p className="text-gray-300 text-center max-w-2xl mx-auto mb-16">
                I'm always open to exciting opportunities and collaborations. Let's connect!
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {userData.email && (
                  <a
                    href={`mailto:${userData.email}`}
                    className="group relative p-6 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/30 flex flex-col items-center text-center"
                  >
                    <div className="p-4 bg-cyan-500/20 rounded-full mb-4 group-hover:bg-cyan-500/40 transition-colors">
                      <Mail size={28} className="text-cyan-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">Email</p>
                    <p className="text-gray-300 text-sm truncate">{userData.email}</p>
                  </a>
                )}
                {userData.phone && (
                  <a
                    href={`tel:${userData.phone}`}
                    className="group relative p-6 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/30 flex flex-col items-center text-center"
                  >
                    <div className="p-4 bg-cyan-500/20 rounded-full mb-4 group-hover:bg-cyan-500/40 transition-colors">
                      <Phone size={28} className="text-cyan-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">Phone</p>
                    <p className="text-gray-300 text-sm">{userData.phone}</p>
                  </a>
                )}
                {userData.location && (
                  <div className="group relative p-6 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 shadow-lg flex flex-col items-center text-center">
                    <div className="p-4 bg-cyan-500/20 rounded-full mb-4">
                      <MapPin size={28} className="text-cyan-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">Location</p>
                    <p className="text-gray-300 text-sm">{userData.location}</p>
                  </div>
                )}
                {userData.linkedin && (
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-6 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/30 flex flex-col items-center text-center"
                    aria-label="Visit LinkedIn profile"
                  >
                    <div className="p-4 bg-cyan-500/20 rounded-full mb-4 group-hover:bg-cyan-500/40 transition-colors">
                      <Linkedin size={28} className="text-cyan-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">LinkedIn</p>
                    <p className="text-gray-300 text-sm">Connect</p>
                  </a>
                )}
                {userData.github && (
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-6 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/30 flex flex-col items-center text-center"
                    aria-label="Visit GitHub profile"
                  >
                    <div className="p-4 bg-cyan-500/20 rounded-full mb-4 group-hover:bg-cyan-500/40 transition-colors">
                      <Github size={28} className="text-cyan-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">GitHub</p>
                    <p className="text-gray-300 text-sm">View Projects</p>
                  </a>
                )}
                {userData.resume && (
                  <a
                    href={userData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-6 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700 hover:border-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/30 flex flex-col items-center text-center"
                    aria-label="Download resume"
                  >
                    <div className="p-4 bg-cyan-500/20 rounded-full mb-4 group-hover:bg-cyan-500/40 transition-colors">
                      <FileText size={28} className="text-cyan-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">Resume</p>
                    <p className="text-gray-300 text-sm">Download</p>
                  </a>
                )}
              </div>
            </div>
            <div className="w-full flex justify-center mt-12">
              <button
                onClick={scrollToTop}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-xl transition-all"
                aria-label="Back to top"
              >
                Back to Top <ChevronUp size={20} className="inline-block ml-2" />
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative py-12 bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left text-sm md:text-base">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">{userData.name}</span>{" "}
            • Built with{" "}
            <span className="text-cyan-400 font-medium">React</span> &{" "}
            <span className="text-purple-400 font-medium">Tailwind</span>
          </p>
          <div className="flex justify-center md:justify-end space-x-6 mt-4 md:mt-0">
            {userData.github && (
              <a
                href={userData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-transform transform hover:scale-110"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
            )}
            {userData.linkedin && (
              <a
                href={userData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-transform transform hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
            )}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"></div>
      </footer>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          50.1%, 100% {
            opacity: 0;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animate-blink {
          animation: blink 1.5s step-end infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VibrantPortfolio;