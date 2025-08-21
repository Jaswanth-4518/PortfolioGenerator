import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    document.body.style.scrollBehavior = "smooth";
    return () => {
      clearTimeout(timer);
      document.body.style.scrollBehavior = "";
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* === Starfield Background === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Twinkling Stars */}
        {[...Array(120)].map((_, i) => {
          const size = Math.random() < 0.7 ? 1 : Math.random() < 0.95 ? 1.5 : 2.5;
          const delay = Math.random() * 5;
          const duration = 2 + Math.random() * 3;
          const opacity = 0.2 + Math.random() * 0.8;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
        {/* Shooting Star */}
        <div
          className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
          style={{
            left: "10%",
            top: "30%",
            '--start-x': '10%',
            '--end-x': '100vw',
            '--start-y': '30%',
            '--end-y': '20%',
          }}
        />
      </div>

      {/* Header */}
      <header
        className={`relative z-10 max-w-6xl mx-auto px-6 py-3 flex justify-between items-center transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
          style={{ animation: "gradientShift 3s ease-infinite alternate" }}
        >
          GenFolio
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8 md:py-12 flex-1">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side: Headline, Steps, CTA */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            {/* Main Headline */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight transition-all duration-1000 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <span>Design Your Journey,</span>
              <br />
              <span
                className="bg-gradient-to-r from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                style={{ animation: "gradientShift 2.5s ease-infinite" }}
              >
                Present Your Portfolio
              </span>
            </h1>

            {/* How It Works - Responsive Arrows */}
            <div
              className={`text-sm sm:text-base text-gray-300 max-w-lg mx-auto lg:mx-0 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex flex-col items-center sm:flex-row justify-center lg:justify-start gap-2 sm:gap-3 text-center lg:text-left">
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                  ✏️ Fill Details
                </span>
                <span className="text-gray-500 text-lg arrow-icon"></span>
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                  🎨 Pick a Template
                </span>
                <span className="text-gray-500 text-lg arrow-icon"></span>
                <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                  🔮 Get Your Portfolio
                </span>
              </div>
            </div>

            {/* Primary Subheading */}
            <p
              className={`text-base sm:text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Create stunning, responsive portfolios — no coding needed. Launch in minutes, not weeks.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleGetStarted}
              aria-label="Get Started Free"
              className={`group px-8 py-4 rounded-full text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 relative overflow-hidden block mx-auto lg:mx-0 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{
                background: "linear-gradient(90deg, #7C3AED, #DB2777, #EC4899)",
                transitionDelay: "900ms",
              }}
            >
              <span className="relative z-10">Get Started Free</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
            </button>
          </div>

          {/* Right Side: Portfolio Preview Card */}
          <div
            className={`lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            onMouseMove={(e) => {
              const card = e.currentTarget.querySelector(".hover-card");
              if (!card) return;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              card.style.transform = `perspective(1000px) rotateX(${(y - rect.height / 2) / 20}deg) rotateY(${(x - rect.width / 2) / 20}deg) scale3d(1.02, 1.02, 1.02)`;
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget.querySelector(".hover-card");
              card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
            }}
          >
            <div
              className="hover-card relative transform-gpu rounded-3xl overflow-hidden mx-auto group"
              style={{
                width: "clamp(240px, 90vw, 320px)",
                height: "clamp(320px, 90vh, 420px)",
                background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(79,70,227,0.04))",
                border: "1px solid transparent",
                backgroundImage:
                  "linear-gradient(145deg, rgba(0,0,0,1), rgba(0,0,0,1)), linear-gradient(90deg, rgba(168,85,247,0.4), rgba(249,115,22,0.3), rgba(34,197,94,0.3))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.05)",
                transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
              }}
            >
              {/* Top Accent Bar */}
              <div className="w-full h-1 bg-gradient-to-r from-purple-500/60 via-pink-500/60 to-blue-500/60" />

              {/* Avatar */}
              <div className="flex justify-center mt-5">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center border-2 border-white/40 shadow-lg relative group-hover:scale-105 transition-transform duration-300"
                  style={{ boxShadow: "0 0 25px rgba(192, 38, 212, 0.4)" }}
                >
                  <span className="text-white font-bold text-sm sm:text-lg drop-shadow-sm">JD</span>
                  <div
                    className="absolute inset-0 rounded-full bg-pink-500/40 animate-ping"
                    style={{ animationDuration: "2s" }}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-60" />
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center mt-4 px-5">
                <h2
                  className="text-lg sm:text-xl font-bold text-white truncate"
                  title="John Doe"
                >
                  John Doe
                </h2>
                <p className="text-purple-200 text-xs sm:text-sm mt-1 truncate">
                  Frontend Developer & Designer
                </p>
              </div>

              {/* Skills */}
              <div className="px-5 mt-5 space-y-2.5">
                <div className="text-xs font-medium text-gray-300">Skills</div>
                {[
                  { label: "React", width: "90%", color: "from-pink-500 to-purple-600" },
                  { label: "UI/UX", width: "85%", color: "from-blue-500 to-cyan-400" },
                  { label: "Figma", width: "75%", color: "from-yellow-500 to-orange-500" },
                ].map((skill, idx) => (
                  <div key={idx} className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full shadow-inner transition-all duration-1000 ease-out`}
                      style={{
                        width: isVisible ? skill.width : "0%",
                        transitionDelay: `${600 + idx * 150}ms`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Featured Project */}
              <div className="px-5 mt-5">
                <div className="text-xs text-gray-300 mb-1">Featured Project</div>
                <div className="text-xs sm:text-sm font-medium text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors duration-300 truncate">
                  ✨ Dashboard Redesign
                </div>
              </div>

              {/* CTA Link with Glow */}
              <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <div
                  className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-full border border-purple-500/40 hover:bg-white/20 transition-all duration-300 group/link"
                  style={{ boxShadow: "0 0 15px rgba(168,85,247,0.15)" }}
                >
                  <span
                    className="text-xs text-purple-200 truncate max-w-[130px] sm:max-w-[160px]"
                    title="genfolio.io/john"
                  >
                    genfolio.io/john
                  </span>
                  <svg
                    className="w-3 h-3 text-purple-200 group-hover/link:translate-x-0.5 group-hover/link:text-white transition-all duration-300 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11 3a1 1 0 10-2 0v7.586L6.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 10-1.414-1.414L11 10.586V3z" />
                  </svg>
                </div>
              </div>

              {/* Subtle Glow Overlay */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(circle at 50% 20%, rgba(168,85,247,0.2), transparent 40%),
                    radial-gradient(circle at 50% 80%, rgba(249,115,22,0.1), transparent 40%)
                  `,
                  filter: "blur(1px)",
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Custom Cursor (Desktop Only) */}
      <div
        id="custom-cursor"
        className="fixed w-6 h-6 pointer-events-none z-50 rounded-full bg-purple-500/30 border border-purple-400/50 mix-blend-difference transition-transform duration-100 hidden md:block"
        style={{ transform: "translate(-50%, -50%)", left: "-100px" }}
      />

      {/* Global Styles */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
          90% {
            transform: translateX(var(--end-x)) translateY(var(--end-y)) scale(0);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-twinkle {
          animation: twinkle 3s infinite ease-in-out;
        }
        .animate-shooting-star {
          animation: shooting-star 6s ease-out 2s infinite;
          transform-origin: center;
        }
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }

        /* Responsive Arrows: → on desktop, ↓ on mobile */
        .arrow-icon {
          display: inline-block;
        }
        .arrow-icon::after {
          content: '→';
        }
        @media (max-width: 640px) {
          .arrow-icon::after {
            content: '↓';
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-twinkle,
          .animate-shooting-star {
            animation: none !important;
          }
        }
      `}</style>

      {/* Cursor Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const cursor = document.getElementById("custom-cursor");
              if (!cursor) return;
              document.addEventListener("mousemove", (e) => {
                cursor.style.left = e.clientX + "px";
                cursor.style.top = e.clientY + "px";
              });
              const interactive = document.querySelectorAll("button, a, [role='button'], .hover-card");
              interactive.forEach(item => {
                item.addEventListener("mouseenter", () => {
                  cursor.style.transform = "translate(-50%, -50%) scale(3.5)";
                  cursor.style.borderColor = "rgba(236, 72, 153, 0.8)";
                  cursor.style.backgroundColor = "rgba(139, 92, 246, 0.3)";
                });
                item.addEventListener("mouseleave", () => {
                  cursor.style.transform = "translate(-50%, -50%) scale(1)";
                  cursor.style.borderColor = "rgba(139, 92, 246, 0.3)";
                  cursor.style.backgroundColor = "rgba(139, 92, 246, 0.1)";
                });
              });
            })();
          `,
        }}
      />
    </div>
  );
}