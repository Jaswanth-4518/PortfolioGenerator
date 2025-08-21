import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  Briefcase,
  Book,
  Code,
  MapPin,
  FileText,
  FolderKanban,
  Trophy,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

// === Move SectionHeading Outside Render ===
const SectionHeading = ({ icon: Icon, title }) => (
  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-orange-100 flex items-center justify-center gap-3 mb-10">
    <Icon size={28} className="text-rose-300" aria-hidden="true" />
    <span>{title}</span>
  </h2>
);

const LumenPortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // === Refs ===
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const certificationsRef = useRef(null);
  const contactRef = useRef(null);

  // === Nav Items ===
  const navItems = useMemo(
    () => [
      { label: "Home", ref: heroRef, id: "hero" },
      { label: "About", ref: aboutRef, id: "about" },
      { label: "Education", ref: educationRef, id: "education" },
      { label: "Skills", ref: skillsRef, id: "skills" },
      { label: "Experience", ref: experienceRef, id: "experience" },
      { label: "Projects", ref: projectsRef, id: "projects" },
      { label: "Certifications", ref: certificationsRef, id: "certifications" },
      { label: "Contact", ref: contactRef, id: "contact" },
    ],
    []
  );

  // === Section Visibility Logic ===
  const hasSection = (data, section) => {
    if (!data) return false;
    switch (section) {
      case "about":
        return !!(data.experience || data.tagline || data.bio);
      case "education":
        return data.education?.some((edu) => edu.school);
      case "skills":
        return (data.technicalSkills?.length || data.professionalSkills?.length) > 0;
      case "experience":
        return data.workExperience?.length > 0;
      case "projects":
        return data.projects?.length > 0;
      case "certifications":
        return data.certifications?.length > 0;
      case "contact":
        // Require at least two contact methods to avoid sparse UI
        const contactMethods = [
          data.email,
          data.phone,
          data.linkedin,
          data.github,
          data.location,
          data.resume,
        ].filter(Boolean);
        return contactMethods.length >= 2;
      default:
        return true;
    }
  };

  // === Filter Visible Nav Items ===
  const visibleNavItems = useMemo(() => {
    if (!userData) return [navItems[0]];
    return navItems.filter(({ id }) => hasSection(userData, id));
  }, [userData, navItems]);

  // === Fetch User Data ===
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/users/${id}`)
      .then((res) => {
        setUserData(res.data);
        document.title = res.data.name
          ? `${res.data.name} | Portfolio`
          : "Portfolio";
      })
      .catch((err) => console.error("Failed to load user data:", err));
  }, [id]);

  // === Scroll-spy ===
  useEffect(() => {
    if (!userData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const id = visible.target.getAttribute("id");
          if (id) setActiveSection(id);
        }
      },
      { threshold: 0.2, rootMargin: "-100px 0px -100px 0px" }
    );

    const sectionNodes = [
      heroRef,
      aboutRef,
      educationRef,
      skillsRef,
      experienceRef,
      projectsRef,
      certificationsRef,
      contactRef,
    ]
      .map((ref) => ref.current)
      .filter(Boolean);

    sectionNodes.forEach((node) => observer.observe(node));
    return () => sectionNodes.forEach((node) => observer.unobserve(node));
  }, [userData]);

  // === Back to Top: Show after significant scroll ===
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls past 800px
      setShowBackToTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === Scroll to Section ===
  const scrollToSection = useCallback((ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  }, []);

  // === Scroll to Top ===
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full mb-6"></div>
          <p className="text-rose-400 text-lg">Loading your story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black text-gray-100 overflow-x-hidden">
      {/* === Background & Glow === */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse -z-20"></div>
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000 -z-20"></div>
      <div className="fixed top-2/3 left-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-500 -z-20"></div>

      {/* === Responsive Navbar === */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
        {/* Desktop */}
        <div className="hidden sm:flex justify-center pointer-events-auto">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 overflow-hidden">
            <div className="flex items-center px-6 py-3 space-x-6">
              {visibleNavItems.map(({ label, ref, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(ref)}
                  className={`font-medium text-sm transition-all duration-300 ${
                    activeSection === id
                      ? "text-rose-400 underline underline-offset-4 scale-105"
                      : "text-gray-200 hover:text-rose-300"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center pointer-events-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-blue-900/30 backdrop-blur-lg rounded-full p-2 border border-blue-500/30 mr-3"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-white font-semibold">Portfolio</span>
        </div>
        {menuOpen && (
          <div className="sm:hidden mt-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
            {visibleNavItems.map(({ label, ref, id }) => (
              <button
                key={id}
                onClick={() => scrollToSection(ref)}
                className={`block w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                  activeSection === id
                    ? "text-rose-400 bg-rose-900/20"
                    : "text-gray-200 hover:bg-white/10"
                }`}
                aria-current={activeSection === id ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* === Hero === */}
      <section ref={heroRef} id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-rose-700/40 to-transparent transform -translate-x-1/2 hidden md:block"></div>
        <div className="relative z-10 max-w-2xl w-full space-y-8 text-center">
          <h1
            className="text-3xl sm:text-5xl lg:text-7xl font-black bg-gradient-to-b from-rose-200 to-orange-100 bg-clip-text text-transparent leading-tight animate-slideIn"
            style={{ animationDelay: "0.3s" }}
          >
            {userData.name}
          </h1>
          <div className="flex justify-center animate-slideIn" style={{ animationDelay: "0.7s" }}>
            <div className="group relative">
              <div className="absolute inset-0 w-40 h-40 sm:w-60 sm:h-60 rounded-2xl bg-gradient-to-tr from-rose-500/40 via-orange-400/30 to-amber-300/30 blur-md scale-95 group-hover:scale-105 transition-transform duration-500"></div>
              <img
                src={userData.profilePhoto || "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"}
                alt={userData.name || "Profile"}
                className="relative w-40 h-40 sm:w-60 sm:h-60 rounded-2xl object-cover border-4 border-white shadow-2xl"
                onError={(e) =>
                  (e.target.src = "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg")
                }
              />
              {userData.experience==="Fresher" && (
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  🚀 Open to Work
                </div>
              )}
            </div>
          </div>
          <p
            className="text-lg sm:text-2xl lg:text-3xl font-light text-rose-300 animate-slideIn"
            style={{ animationDelay: "1.1s" }}
          >
            {userData.headline}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-slideIn"
            style={{ animationDelay: "1.4s" }}
          >
            <button
              onClick={() => scrollToSection(contactRef)}
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <Mail size={16} className="inline mr-2" aria-hidden="true" /> Get In Touch
            </button>
            <button
              onClick={() => scrollToSection(projectsRef)}
              className="border border-rose-400 text-rose-200 hover:bg-rose-900/40 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <FolderKanban size={16} className="inline mr-2" aria-hidden="true" /> View Projects
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-70 hover:opacity-100 transition">
          <ChevronDown className="h-6 w-6 text-rose-400 animate-bounce" aria-hidden="true" />
        </div>
      </section>

      {/* === Animations (Consolidated) === */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(4px);
        }
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          70% {
            transform: scale(1.8);
            opacity: 0;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .bg-noise-pattern {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.06;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* === Main Content === */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 relative z-10">
        {/* === About === */}
        {hasSection(userData, "about") && (
          <section ref={aboutRef} id="about" className="py-16 px-4">
            <SectionHeading icon={MessageCircle} title="About Me" />
            <div className="w-16 h-0.5 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="mb-8"></div>
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={
                    userData.gender === "Male"
                      ? "/man.jpg"
                      : userData.gender === "Female"
                      ? "/woman.jpg"
                      : "/other.jpg"
                  }
                  alt="Profile"
                  className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-3xl shadow-2xl border-4 border-white"
                  onError={(e) => (e.target.src = "/man.jpg")}
                />
              </div>
            </div>
            {userData.tagline && (
              <p className="text-center text-gray-300 text-sm md:text-base italic mb-6 max-w-lg mx-auto line-clamp-2">
                "{userData.tagline}"
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
              {[
                { label: "Email", value: userData.email, icon: "✉️" },
                { label: "Location", value: userData.location || "N/A", icon: "📍" },
                { label: "Qualification", value: userData.highestQualification || "N/A", icon: "🎓" },
                { label: "Experience", value: userData.experience || "N/A", icon: "💼" },
                { label: "Freelance", value: userData.freelanceAvailable ? "Available" : "Not Available", icon: "🔧" },
                { label: "Role", value: userData.headline || "N/A", icon: "🛠️" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg border border-gray-700 text-center hover:border-rose-600 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="text-xl mb-2">{item.icon}</div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">{item.label}</p>
                  <p className="text-sm sm:text-base font-semibold text-white mt-1 line-clamp-2">{item.value}</p>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-rose-500/30 to-pink-600/30 pointer-events-none transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === Education === */}
        {hasSection(userData, "education") && (
          <section ref={educationRef} id="education" className="py-16 px-4">
            <SectionHeading icon={Book} title="Education" />
            <div className="w-16 h-0.5 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="mb-8"></div>
            <div className="max-w-4xl mx-auto space-y-6">
              {userData.education
                .filter((edu) => edu.school)
                .map((edu, idx) => {
                  const startDate = new Date(edu.startDate).getFullYear();
                  const endDate = edu.endDate ? new Date(edu.endDate).getFullYear() : "Present";
                  return (
                    <div key={idx} className="relative pl-8 sm:pl-12 md:pl-16 py-2 group">
                      <div className="absolute left-2 sm:left-3 top-4 w-4 h-4 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 shadow-lg border-4 border-gray-900 group-hover:scale-110 transition-transform duration-300" />
                      {idx < userData.education.filter((e) => e.school).length - 1 && (
                        <div className="absolute left-3 sm:left-4 top-8 w-0.5 h-full bg-gradient-to-b from-rose-400/50 to-transparent"></div>
                      )}
                      <div className="bg-slate-800/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-xl hover:shadow-rose-500/10 hover:border-rose-600/50 hover:scale-102 transition-all duration-500 transform-gpu relative">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">{edu.degree}</h3>
                            <p className="text-rose-300 font-medium text-sm mt-1">{edu.field}</p>
                            <p className="text-gray-200 text-sm mt-1">{edu.school}</p>
                          </div>
                          <div className="flex items-center justify-end mt-1 sm:mt-0">
                            <span className="text-xs sm:text-sm text-gray-300 bg-gradient-to-r from-rose-500/20 to-pink-500/20 px-3 py-1.5 rounded-full border border-rose-500/30 shadow-sm">
                              {startDate} – {endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* === Skills === */}
        {hasSection(userData, "skills") && (
          <section ref={skillsRef} id="skills" className="py-20 px-4 md:px-8 relative">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <SectionHeading icon={Code} title="Skills & Expertise" />
              <div className="w-16 h-0.5 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="mb-8"></div>
              <p className="text-gray-400 mt-3 text-base">
                A curated list of my technical tools and professional strengths, with proficiency at a glance.
              </p>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Technical Skills */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="bg-cyan-900/70 px-3 py-1 rounded-full text-sm text-cyan-300 font-medium border border-cyan-700">
                    Technical
                  </span>
                </h3>
                <div className="space-y-4">
                  {userData.technicalSkills?.map((skill, i) => (
                    <div
                      key={`tech-${i}`}
                      className="group relative p-4 bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-lg border border-cyan-900/30 transition-all duration-300 hover:border-cyan-500 hover:shadow-cyan-500/20"
                    >
                      <h4 className="text-xl font-bold text-white mb-2">{skill.name}</h4>
                      <div className="relative w-20 h-20 mx-auto">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#techGradient)"
                            strokeWidth="8"
                            strokeDasharray={`${(2 * Math.PI * 45 * skill.level) / 100} ${2 * Math.PI * 45}`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#74b9ff" />
                              <stop offset="100%" stopColor="#3498db" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-medium">
                          {skill.level}%
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-md transition-opacity duration-300 -z-10"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Professional Skills */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="bg-green-900/70 px-3 py-1 rounded-full text-sm text-green-300 font-medium border border-green-700">
                    Professional
                  </span>
                </h3>
                <div className="space-y-4">
                  {userData.professionalSkills?.map((skill, i) => (
                    <div
                      key={`prof-${i}`}
                      className="group relative p-4 bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-lg border border-green-900/30 transition-all duration-300 hover:border-green-500 hover:shadow-green-500/20"
                    >
                      <h4 className="text-xl font-bold text-white mb-2">{skill.name}</h4>
                      <div className="relative w-20 h-20 mx-auto">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#profGradient)"
                            strokeWidth="8"
                            strokeDasharray={`${(2 * Math.PI * 45 * skill.level) / 100} ${2 * Math.PI * 45}`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="profGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#a8e063" />
                              <stop offset="100%" stopColor="#42b983" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-medium">
                          {skill.level}%
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-gradient-to-r from-green-500/20 to-lime-500/20 blur-md transition-opacity duration-300 -z-10"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* === Experience === */}
        {hasSection(userData, "experience") && (
          <section ref={experienceRef} id="experience" className="py-24 px-4 md:px-12 relative overflow-hidden">
            <div className="text-center mb-16">
              <SectionHeading icon={Briefcase} title="Professional Journey" />
              <div className="w-16 h-0.5 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="mb-8"></div>
              <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl mx-auto">
                A glimpse into my career path and impactful roles.
              </p>
            </div>
            <div className="max-w-5xl mx-auto relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent hidden sm:block"></div>
              <div className="space-y-16 md:space-y-20">
                {userData.workExperience.map((exp, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      className={`group relative flex flex-col sm:flex-row items-center ${isLeft ? "sm:flex-row-reverse" : ""}`}
                      style={{
                        opacity: 0,
                        transform: "translateY(30px)",
                        animation: `fadeInSlide 0.8s ease-out forwards ${idx * 0.15}s`,
                      }}
                    >
                      <div className="hidden sm:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-lg border-2 border-gray-900 z-10 group-hover:scale-150 transition-transform duration-300"></div>
                      <div
                        className={`sm:w-5/12 w-full max-w-md mx-auto sm:mx-0 bg-gray-900/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-700/40 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-500 transform hover:scale-105 relative z-0 flex flex-col h-64`}
                      >
                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {exp.role}
                        </h3>
                        <span className="text-cyan-400 font-medium text-sm mb-1">{exp.company}</span>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3 opacity-70" aria-hidden="true" /> {exp.duration}
                        </p>
                        <p className="text-gray-200 text-sm mt-3 leading-relaxed flex-1 line-clamp-3">{exp.description}</p>
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-cyan-400/30 to-indigo-600/30 pointer-events-none transition-opacity duration-500"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* === Projects === */}
        {hasSection(userData, "projects") && (
          <section ref={projectsRef} id="projects" className="py-24 px-4 relative">
            <SectionHeading icon={FolderKanban} title="Projects" />
            <div className="w-16 h-0.5 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="mb-8"></div>
            <p className="text-gray-400 text-center mt-3 text-base leading-relaxed max-w-2xl mx-auto mb-12">
              Crafted with precision. Engineered for impact. Each one a step forward.
            </p>
            <div className="space-y-12 max-w-6xl mx-auto">
              {userData.projects.map((p, idx) => {
                const cardGradients = [
                  "from-gray-900/90 via-purple-950/40 to-black",
                  "from-gray-900/90 via-emerald-950/35 to-black",
                  "from-gray-900/90 via-indigo-950/40 to-black",
                  "from-gray-900/90 via-rose-950/35 to-black",
                ];
                const gradientClass = cardGradients[idx % cardGradients.length];
                return (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={idx}
                    className="block group"
                    style={{
                      opacity: 0,
                      transform: "translateY(30px)",
                      animation: `fadeInUp 0.9s ease-out forwards ${idx * 0.15}s`,
                    }}
                  >
                    <div
                      className={`relative p-7 md:p-10 rounded-3xl overflow-hidden backdrop-blur-sm border border-gray-700/50 bg-gradient-to-br ${gradientClass} shadow-lg transition-all duration-700 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-700/20 group-hover:shadow-white/10 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/30 before:to-transparent before:rounded-3xl before:pointer-events-none before:-z-10`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-purple-800/25 to-pink-800/15 blur-3xl transition-opacity duration-700 -z-10"></div>
                      <div className="absolute inset-0 opacity-8 bg-noise-pattern pointer-events-none -z-10"></div>
                      <div className="relative z-10">
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight group-hover:text-purple-50 transition-colors duration-500">
                          {p.title}
                        </h3>
                        <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">{p.description}</p>
                        <div className="flex flex-wrap gap-2.5 mb-6">
                          {(p.technologies || p.tech || [])
                            .slice(0, 4)
                            .map((tech, i) => (
                              <span
                                key={i}
                                className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-gray-100 border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 hover:bg-gradient-to-r hover:from-purple-700/30 hover:to-pink-700/30 hover:text-purple-100 hover:border-purple-600/40"
                              >
                                {tech}
                              </span>
                            ))}
                        </div>
                        <span className="inline-flex items-center gap-2.5 text-lg font-medium text-white group-hover:text-purple-200 transition-all duration-300 group-hover:gap-3">
                          View Project
                          <span className="relative">
                            <ExternalLink
                              size={18}
                              className="transition-transform duration-300 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                            <span className="absolute -right-2 top-1 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-ping"></span>
                          </span>
                        </span>
                      </div>
                      <div className="absolute bottom-6 right-8 w-24 h-0.5 bg-gradient-to-r from-transparent to-purple-400/80 rotate-12 transform origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-700"></div>
                    </div>
                  </a>
                );
              })}
            </div>
            {userData.github && (
              <div className="text-center mt-16">
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105"
                >
                  <Github size={20} aria-hidden="true" /> View All Projects on GitHub
                </a>
              </div>
            )}
          </section>
        )}

        {/* === Certifications === */}
        {hasSection(userData, "certifications") && (
          <section ref={certificationsRef} id="certifications" className="py-20 px-4 sm:px-6">
            <SectionHeading icon={Trophy} title="Certifications" />
            <div className="w-16 h-0.5 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="mb-8"></div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {userData.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="group relative p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-pink-900/40 hover:border-pink-500/60 transition-all duration-500 overflow-hidden"
                  style={{
                    boxShadow: "0 0 10px rgba(190, 24, 98, 0)",
                    transition: "box-shadow 0.5s ease",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <div className="absolute inset-0 rounded-xl shadow-neon-pink pointer-events-none"></div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-pink-100 transition-colors">{cert.title}</h3>
                    <p className="text-gray-300 text-sm mt-2 flex items-center">
                      <BuildingOffice2Icon className="h-4 w-4 mr-2 text-rose-400" aria-hidden="true" /> {cert.issuer}
                    </p>
                    <p className="text-gray-400 text-xs mt-3 flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-2 text-pink-400" aria-hidden="true" /> {cert.date}
                    </p>
                    {cert.verified && (
                      <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-900/50 text-rose-200 border border-rose-800/50 group-hover:bg-rose-800/60 transition-colors">
                        <CheckBadgeIcon className="h-3 w-3 mr-1 text-rose-300" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="absolute -right-2 -top-2 w-4 h-4 bg-pink-500 rounded-full opacity-0 group-hover:opacity-70 animate-ping"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === Contact === */}
        {hasSection(userData, "contact") && (
          <section ref={contactRef} id="contact" className="py-18 px-6">
            <SectionHeading icon={MessageCircle} title="Let’s Connect" />
            <div className="w-16 h-0.5 mx-auto mt-6 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="mb-8"></div>
            <p className="text-gray-300 text-center text-lg max-w-2xl mx-auto mb-12">
              Whether it’s a project, collaboration, or just a quick chat — I’d love to hear from you.
            </p>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                {userData.email && (
                  <a
                    href={`mailto:${userData.email}`}
                    className="flex items-start group p-4 rounded-lg hover:bg-rose-500/10 transition-all"
                  >
                    <div className="p-2.5 rounded-md bg-rose-500 text-white mr-4">
                      <Mail size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-rose-300">{userData.email}</p>
                      <p className="text-rose-400 text-sm mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to email
                      </p>
                    </div>
                  </a>
                )}
                {userData.phone && (
                  <a
                    href={`tel:${userData.phone}`}
                    className="flex items-start group p-4 rounded-lg hover:bg-orange-500/10 transition-all"
                  >
                    <div className="p-2.5 rounded-md bg-orange-500 text-white mr-4">
                      <Phone size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-orange-300">{userData.phone}</p>
                      <p className="text-orange-400 text-sm mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Tap to call
                      </p>
                    </div>
                  </a>
                )}
              </div>
              <div className="space-y-6">
                {userData.linkedin && (
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start group p-4 rounded-lg hover:bg-blue-500/10 transition-all"
                  >
                    <div className="p-2.5 rounded-md bg-blue-600 text-white mr-4">
                      <Linkedin size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-blue-300">LinkedIn</p>
                      <p className="text-blue-400 text-sm mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        View profile
                      </p>
                    </div>
                  </a>
                )}
                {userData.github && (
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start group p-4 rounded-lg hover:bg-gray-700/20 transition-all"
                  >
                    <div className="p-2.5 rounded-md bg-gray-700 text-white mr-4">
                      <Github size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-gray-300">GitHub</p>
                      <p className="text-gray-400 text-sm mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore my repos
                      </p>
                    </div>
                  </a>
                )}
              </div>
              <div className="space-y-6">
                {userData.location && (
                  <div className="flex items-start p-4 rounded-lg">
                    <div className="p-2.5 rounded-md bg-gray-700 text-gray-300 mr-4">
                      <MapPin size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">Location</p>
                      <p className="text-gray-400 text-sm mt-0.5">{userData.location}</p>
                    </div>
                  </div>
                )}
                {userData.resume && (
                  <a
                    href={userData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start group p-4 rounded-lg hover:bg-emerald-500/10 transition-all"
                  >
                    <div className="p-2.5 rounded-md bg-emerald-600 text-white mr-4">
                      <FileText size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-emerald-300">Download Resume</p>
                      <p className="text-emerald-400 text-sm mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {userData.resume?.endsWith(".pdf") ? "PDF format" : "Document"}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
            <div className="max-w-5xl mx-auto mt-20">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <p className="text-center text-gray-500 text-sm mt-6">
                Always excited to collaborate on meaningful work.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* === Back to Top Button (Centered) === */}
      {hasSection(userData, "contact") && (
        <div className="mt-6 mb-4 text-center">
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50 animate-fadeIn"
              aria-label="Back to top"
            >
              <ChevronUp size={24} aria-hidden="true" />
              <span className="sr-only">Back to top</span>
            </button>
          )}
        </div>
      )}

      {/* === Footer === */}
      <footer className="py-5 text-center text-gray-500 text-xs sm:text-sm border-t border-gray-800 px-4">
        <p className="text-white/60 text-sm mb-4 md:mb-0">
  Crafted with care by {userData.name} 🎓🚀
</p>
      </footer>
    </div>
  );
};

export default LumenPortfolio;