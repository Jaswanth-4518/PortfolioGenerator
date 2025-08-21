// src/pages/CreativePortfolio.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ChevronDown,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
  Download,
  Code,
  Briefcase,
  Award,
  Users,
  Book,
  MessageCircle,
} from "lucide-react";

const CreativePortfolio = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionRefs = useRef({});

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/users/${id}`);
        setUserData(res.data);
        document.title = res.data.name
          ? `${res.data.name} | Portfolio`
          : "Portfolio";
      } catch (err) {
        console.error("Error fetching data:", err);
        setUserData(null);
      }
    };
    fetchUserData();
  }, [id]);

  // Memoized showSection with robust array checks
  const showSection = useCallback(
    (section) => {
      if (!userData) return false;
      switch (section) {
        case "about":
          return !!userData.tagline;
        case "education":
          return (
            Array.isArray(userData.education) &&
            userData.education.some((e) => e.school?.trim() && e.degree?.trim())
          );
        case "skills":
          return (
            (Array.isArray(userData.technicalSkills) && userData.technicalSkills.length > 0) ||
            (Array.isArray(userData.professionalSkills) && userData.professionalSkills.length > 0)
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
    },
    [userData]
  );

  // Ref setter
  const setRef = useCallback((key) => (el) => {
    if (el) sectionRefs.current[key] = el;
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    if (!userData) return;

    let observer;

    const setupObserver = () => {
      if (observer) observer.disconnect();

      const options = {
        threshold: 0.2,
        rootMargin: "-80px 0px -80px 0px",
      };

      observer = new IntersectionObserver((entries) => {
        entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      }, options);

      Object.entries(sectionRefs.current).forEach(([key, ref]) => {
        if (ref && showSection(key)) {
          observer.observe(ref);
        }
      });
    };

    const timer1 = setTimeout(setupObserver, 500);
    const timer2 = setTimeout(setupObserver, 1500);

    const handleResize = () => setTimeout(setupObserver, 100);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", handleResize);
      if (observer) observer.disconnect();
    };
  }, [userData, showSection]);

  // Scroll to section with safety delay
  const scrollToSection = useCallback((sectionId) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
    setIsMenuOpen(false);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Format duration from dates
  const formatDuration = (start, end) => {
    if (!start) return "";
    const startYear = new Date(start).getFullYear();
    const endYear = end ? new Date(end).getFullYear() : "Present";
    return `${startYear} – ${endYear}`;
  };

  const navItems = [
    { id: "home", label: "Home", icon: Code },
    { id: "about", label: "About", icon: Users },
    { id: "education", label: "Education", icon: Book },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ].filter((item) => showSection(item.id));

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto animate-spin"></div>
          <p className="text-blue-400 mt-6 text-lg">Loading Portfolio...</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative font-sans">
      {/* === Sticky Header === */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={scrollToTop}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition"
            aria-label="Back to top"
          >
            Portfolio
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-6">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`text-sm font-medium transition duration-300 capitalize
                  ${activeSection === id ? "text-blue-400" : "text-gray-300 hover:text-white"}`}
                aria-current={activeSection === id ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <div className="text-xl" aria-hidden="true">
              {isMenuOpen ? "✕" : "☰"}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/90 backdrop-blur-md py-4 px-6 space-y-4 relative z-10">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`block w-full text-left py-2 px-4 rounded-lg transition
                  ${activeSection === id ? "bg-blue-500/30 text-blue-300" : "text-gray-300 hover:bg-gray-800"}`}
                aria-current={activeSection === id ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* === Main Content === */}
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        {/* === HERO === */}
        <section
          id="home"
          ref={setRef("home")}
          className="min-h-screen flex flex-col items-center justify-center text-center pb-32"
        >
          <div className="space-y-6">
            <img
              src={
                userData.profilePhoto ||
                "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg"
              }
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto border-4 border-blue-500 shadow-2xl"
              onError={(e) =>
                (e.target.src =
                  "https://photosnow.net/wp-content/uploads/2024/04/no-dp-mood-off_9.jpg")
              }
            />
            {userData.experience === "Fresher" && (
              <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Available for Work
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              {userData.name}
            </h1>
            <p className="text-xl text-blue-300">{userData.headline}</p>
            <p className="text-gray-400 flex justify-center items-center gap-2">
              <MapPin size={16} aria-hidden="true" /> {userData.location}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {userData.resume && (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <Download size={14} aria-hidden="true" /> Download Resume
                </a>
              )}
              {userData.email && (
                <a
                  href={`mailto:${userData.email}`}
                  className="flex items-center gap-2 border border-blue-500 px-5 py-2 rounded-lg text-sm hover:bg-blue-500/20 transition"
                >
                  <Mail size={14} aria-hidden="true" /> Contact Me
                </a>
              )}
            </div>

            <button
              onClick={() => scrollToSection("about")}
              className="mt-10 text-blue-400 hover:text-blue-300 animate-bounce"
              aria-label="Scroll to About"
            >
              <ChevronDown size={24} aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* === ABOUT === */}
        {showSection("about") && (
          <section id="about" ref={setRef("about")} className="py-24 min-h-96">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-10 text-center">
              About Me
            </h2>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {userData.tagline}
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                {[
                  { label: "Name", value: userData.name },
                  { label: "Field", value: userData.highestQualification || "N/A" },
                  { label: "Experience", value: userData.experience || "N/A" },
                  {
                    label: "Freelance",
                    value: userData.freelanceAvailable ? "Available" : "Not Available",
                  },
                  { label: "Email", value: userData.email },
                  { label: "Location", value: userData.location },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b border-gray-800 last:border-b-0"
                  >
                    <span className="text-gray-500">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* === EDUCATION === */}
        {showSection("education") && (
          <section
            id="education"
            ref={setRef("education")}
            className="py-24 min-h-96"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-10 text-center">
              Education
            </h2>
            <div className="space-y-6">
              {Array.isArray(userData.education)
                ? userData.education
                    .filter((e) => e.school?.trim() && e.degree?.trim())
                    .map((edu, i) => (
                      <div
                        key={i}
                        className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-600 transition"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div>
                            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                            <p className="text-cyan-400 font-medium">{edu.field}</p>
                            <p className="text-gray-300">{edu.school}</p>
                            {edu.location && (
                              <p className="text-gray-500 text-sm mt-1">📍 {edu.location}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">
                              {new Date(edu.startDate).getFullYear()} –{" "}
                              {edu.endDate
                                ? new Date(edu.endDate).getFullYear()
                                : "Present"}
                            </p>
                            {edu.grade && (
                              <p className="text-green-400 font-bold text-sm mt-1 bg-green-400/10 px-2 py-1 rounded inline">
                                GPA: {edu.grade}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                : null}
            </div>
          </section>
        )}

        {/* === SKILLS === */}
        {showSection("skills") && (
          <section
            id="skills"
            ref={setRef("skills")}
            className="py-24 min-h-96"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent mb-10 text-center">
              Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {Array.isArray(userData.technicalSkills) && userData.technicalSkills.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                    <Code size={18} aria-hidden="true" /> Technical
                  </h3>
                  {userData.technicalSkills.map((s, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{s.name}</span>
                        <span className="text-blue-400">{s.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                          style={{ width: `${s.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {Array.isArray(userData.professionalSkills) && userData.professionalSkills.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                    <Users size={18} aria-hidden="true" /> Professional
                  </h3>
                  {userData.professionalSkills.map((s, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{s.name}</span>
                        <span className="text-green-400">{s.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
                          style={{ width: `${s.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* === EXPERIENCE === */}
        {showSection("experience") && (
          <section
            id="experience"
            ref={setRef("experience")}
            className="py-24 min-h-96"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-10 text-center">
              Experience
            </h2>
            <div className="space-y-6">
              {Array.isArray(userData.workExperience) &&
                userData.workExperience.map((exp, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-600 transition"
                  >
                    <h3 className="text-xl font-bold text-blue-300">{exp.role}</h3>
                    <p className="text-white font-medium">{exp.company}</p>
                    {exp.companyWebsite && (
                      <a
                        href={exp.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm hover:underline mt-1 block"
                      >
                        🌐 Visit Website
                      </a>
                    )}
                    <p className="text-gray-400 mt-3">{exp.description}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {exp.duration || formatDuration(exp.startDate, exp.endDate)}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* === PROJECTS === */}
        {showSection("projects") && (
          <section
            id="projects"
            ref={setRef("projects")}
            className="py-24 min-h-96"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-10 text-center">
              Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Array.isArray(userData.projects) &&
                userData.projects.map((p, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition group"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300">
                      {p.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {p.description}
                    </p>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 text-sm inline-flex items-center hover:underline"
                      >
                        View Project <ExternalLink size={12} className="ml-1" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
            </div>
            {userData.github && (
              <div className="text-center mt-8">
                <a
                  href={userData.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-2 rounded-lg hover:from-gray-700 hover:to-gray-600 transition"
                >
                  <Github size={16} aria-hidden="true" /> View All on GitHub
                </a>
              </div>
            )}
          </section>
        )}

        {/* === CERTIFICATIONS === */}
        {showSection("certifications") && (
          <section
            id="certifications"
            ref={setRef("certifications")}
            className="py-24 min-h-96"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent mb-6 text-center">
              Certifications
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-sm">
              Industry-recognized credentials that validate my expertise and continuous learning.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array.isArray(userData.certifications) &&
                userData.certifications.map((c, i) => (
                  <div
                    key={i}
                    className="group relative bg-gray-900/60 backdrop-blur-sm border-l-4 border-gradient-to-b from-blue-500 via-cyan-400 to-indigo-500 rounded-r-xl p-5 
                     hover:bg-gray-900 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    <div className="absolute -top-3 left-5">
                      <span className="text-xs font-bold px-3 py-1 bg-black text-blue-300 border border-blue-500/30 rounded-full">
                        {c.issuer.length > 20 ? `${c.issuer.slice(0, 20)}...` : c.issuer}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-blue-300 transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Issued {c.date}</p>
                      {c.link && (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 text-xs mt-3 hover:underline"
                        >
                          <Award size={12} aria-hidden="true" /> Verify Credential
                        </a>
                      )}
                    </div>
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition"></div>
                  </div>
                ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-gray-500 text-sm">Validated through official platforms</p>
            </div>
          </section>
        )}

        {/* === CONTACT === */}
        {showSection("contact") && (
          <section
            id="contact"
            ref={setRef("contact")}
            className="py-24 min-h-96"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-10 text-center">
              Contact
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {userData.email && (
                <a
                  href={`mailto:${userData.email}`}
                  className="bg-gray-900 p-5 rounded-xl border border-gray-700 hover:border-blue-500 transition flex items-center gap-3"
                  rel="me"
                >
                  <Mail size={20} aria-hidden="true" /> <span>{userData.email}</span>
                </a>
              )}
              {userData.phone && (
                <a
                  href={`tel:${userData.phone}`}
                  className="bg-gray-900 p-5 rounded-xl border border-gray-700 hover:border-blue-500 transition flex items-center gap-3"
                >
                  <Phone size={20} aria-hidden="true" /> <span>{userData.phone}</span>
                </a>
              )}
              {userData.linkedin && (
                <a
                  href={userData.linkedin}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="bg-gray-900 p-5 rounded-xl border border-gray-700 hover:border-blue-500 transition flex items-center gap-3"
                >
                  <Linkedin size={20} aria-hidden="true" /> <span>LinkedIn</span>
                </a>
              )}
              {userData.github && (
                <a
                  href={userData.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="bg-gray-900 p-5 rounded-xl border border-gray-700 hover:border-blue-500 transition flex items-center gap-3"
                >
                  <Github size={20} aria-hidden="true" /> <span>GitHub</span>
                </a>
              )}
              {userData.location && (
                <div className="bg-gray-900 p-5 rounded-xl border border-gray-700 flex items-center gap-3">
                  <MapPin size={20} aria-hidden="true" /> <span>{userData.location}</span>
                </div>
              )}
              {userData.resume && (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-5 rounded-xl transition flex items-center justify-center gap-3 font-semibold"
                >
                  <Download size={20} aria-hidden="true" /> Download Resume
                </a>
              )}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 
                           hover:from-gray-700 hover:to-gray-800 border border-gray-600 rounded-full 
                           text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-700/20"
              >
                <ChevronDown
                  size={16}
                  className="transform rotate-180 group-hover:translate-y-[-2px] transition-transform"
                  aria-hidden="true"
                /> Back to Top
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-800">
        <p>
           Built by {userData.name} | {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default CreativePortfolio;