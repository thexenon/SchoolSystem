import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./homepage.css";
import SpinningWordsBackground from "./components/SpinningWordsBackground";

// Import all screenshots and assets from assets directory
import slide1 from "./assets/Screenshot From 2026-10-13 06-35-25.png";
import slide2 from "./assets/Screenshot From 2026-10-13 06-36-12.png";
import slide3 from "./assets/Screenshot From 2026-10-13 06-36-24.png";
import slide4 from "./assets/Screenshot From 2026-09-19 18-38-18.png";
import slide5 from "./assets/hero.png";

const SLIDES = [
  {
    image: slide1,
    title: "Interactive Digital Campus",
    caption: "Empowering collaborative learning and real-time school management.",
  },
  {
    image: slide2,
    title: "Comprehensive Academic Records",
    caption: "Streamlining grading, curriculum planning, and student tracking.",
  },
  {
    image: slide3,
    title: "Smart Attendance & Scheduling",
    caption: "Effortless timetabling and instant attendance synchronization.",
  },
  {
    image: slide4,
    title: "Connected School Community",
    caption: "Fostering collaboration between teachers, students, and parents.",
  },
  {
    image: slide5,
    title: "Unified School Hub Portal",
    caption: "Your all-in-one ecosystem for educational excellence and future growth.",
  },
];

const MOTIVATIONS = [
  {
    id: 1,
    icon: "🚀",
    quote: "The future belongs to those who prepare for it today. Every hour spent learning is an investment in your tomorrow.",
    author: "Malcolm X & Educational Vision",
    floatClass: "hub-float-1",
  },
  {
    id: 2,
    icon: "💡",
    quote: "Education is not just the filling of a bucket, but the lighting of a fire that illuminates the road ahead.",
    author: "William Butler Yeats",
    floatClass: "hub-float-2",
  },
  {
    id: 3,
    icon: "🌟",
    quote: "Your schooling gives you the wings; your curiosity and relentless perseverance decide how high you fly.",
    author: "Future Leadership Academy",
    floatClass: "hub-float-3",
  },
  {
    id: 4,
    icon: "🎓",
    quote: "Dreams don't work unless you do. Step into the classroom with purpose and step out ready to reshape the world.",
    author: "Inspiring Scholars Initiative",
    floatClass: "hub-float-4",
  },
];

function Homepage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slideshow every 3.8 seconds unless paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="hub-container">
      {/* Interactive 3D Spinning Words Aura */}
      <SpinningWordsBackground speed="slow" showControlBadge={true} />

      {/* Ambient background glows */}
      <div className="hub-blob-1" />
      <div className="hub-blob-2" />

      <div className="hub-content">
        {/* Header / Brand Section */}
        <header className="hub-header">
          <div className="hub-badge">
            <span>✨</span> Next-Gen Education Management
          </div>
          <h1 className="hub-title">School Hub</h1>
          <p className="hub-tagline">
            Inspiring minds, tracking progress, and unlocking tomorrow's potential in a single unified educational ecosystem.
          </p>
        </header>

        {/* Interactive Slideshow */}
        <div
          className="hub-slideshow-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Previous Arrow */}
          <button
            type="button"
            className="hub-slide-btn hub-slide-btn-prev"
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            ‹
          </button>

          {/* Current Slide Display */}
          <div className="hub-slide-display">
            <img
              key={currentSlide}
              src={SLIDES[currentSlide].image}
              alt={SLIDES[currentSlide].title}
              className="hub-slide-image"
            />

            {/* Slide Caption Overlay */}
            <div className="hub-slide-caption">
              <div>
                <div className="hub-caption-text">{SLIDES[currentSlide].title}</div>
                <div style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "2px" }}>
                  {SLIDES[currentSlide].caption}
                </div>
              </div>
              <div className="hub-slide-counter">
                {currentSlide + 1} / {SLIDES.length}
              </div>
            </div>
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            className="hub-slide-btn hub-slide-btn-next"
            onClick={handleNext}
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Pagination Dots */}
          <div className="hub-dots-container">
            {SLIDES.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                className={`hub-dot ${currentSlide === idx ? "active" : ""}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Floating Motivations Section */}
        <div className="hub-motivations-header">
          <h2 className="hub-motivations-title">
            <span>✨</span> Words of Inspiration for Your Journey
          </h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "6px 0 0" }}>
            Education is the bridge between who you are and who you are destined to become.
          </p>
        </div>

        <div className="hub-floating-grid">
          {MOTIVATIONS.map((item) => (
            <div key={item.id} className={`hub-quote-card ${item.floatClass}`}>
              <div className="hub-quote-icon">{item.icon}</div>
              <p className="hub-quote-text">"{item.quote}"</p>
              <div className="hub-quote-author">— {item.author}</div>
            </div>
          ))}
        </div>

        {/* Quick Portal Access Bar */}
        <div className="hub-actions">
          <Link to="/login" className="hub-action-btn hub-action-primary">
            <span>🔐</span> Portal Sign In
          </Link>
          <Link to="/student-portal" className="hub-action-btn hub-action-secondary">
            <span>🎓</span> Student Portal
          </Link>
          <Link to="/teacher-portal" className="hub-action-btn hub-action-secondary">
            <span>👨‍🏫</span> Teacher & Faculty Portal
          </Link>
          <Link to="/parent-dashboard" className="hub-action-btn hub-action-secondary">
            <span>👨‍👩‍👧</span> Parent & Guardian Portal
          </Link>
          <Link to="/assignment-list" className="hub-action-btn hub-action-secondary">
            <span>📁</span> Assignments & Learning Materials
          </Link>
          <Link to="/admissions-dashboard" className="hub-action-btn hub-action-secondary">
            <span>🏛️</span> Admissions & Enrollment
          </Link>
          <Link to="/school-dashboard" className="hub-action-btn hub-action-secondary">
            <span>🏫</span> School Administration
          </Link>
          <Link to="/platform-dashboard" className="hub-action-btn hub-action-secondary">
            <span>🌐</span> Multi-School Admin (Boss)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;