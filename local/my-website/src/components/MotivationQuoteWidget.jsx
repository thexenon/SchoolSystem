import React, { useState, useEffect } from "react";
import "./MotivationQuoteWidget.css";

export const MOTIVATIONAL_QUOTES = [
  {
    id: 1,
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    role: "Global Statesman & Nobel Peace Laureate",
    tag: "Transformation",
    avatar: "🌍",
  },
  {
    id: 2,
    quote: "Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family.",
    author: "Kofi Annan",
    role: "Former UN Secretary-General & Ghanaian Diplomat",
    tag: "Progress",
    avatar: "🕊️",
  },
  {
    id: 3,
    quote: "Forward ever, backward never! Seek first the kingdom of knowledge, and all doors shall be opened unto you.",
    author: "Osagyefo Dr. Kwame Nkrumah",
    role: "Founding Father of Modern Ghana",
    tag: "Leadership",
    avatar: "🇬🇭",
  },
  {
    id: 4,
    quote: "Education is not the learning of facts, but the training of the mind to think critically and create solutions.",
    author: "Albert Einstein",
    role: "Theoretical Physicist & Visionary",
    tag: "Innovation",
    avatar: "⚛️",
  },
  {
    id: 5,
    quote: "Do the best you can until you know better. Then when you know better, do better.",
    author: "Maya Angelou",
    role: "Poet, Memoirist & Civil Rights Champion",
    tag: "Excellence",
    avatar: "✍️",
  },
  {
    id: 6,
    quote: "Now is the accepted time, not tomorrow, not some more convenient season. It is today and here that our best work can be done.",
    author: "W.E.B. Du Bois",
    role: "Sociologist, Historian & Pan-Africanist Scholar",
    tag: "Action",
    avatar: "📚",
  },
  {
    id: 7,
    quote: "It's the little things citizens do. That's what will make the difference. My little thing is planting trees of knowledge.",
    author: "Prof. Wangari Maathai",
    role: "Nobel Peace Laureate & Environmental Pioneer",
    tag: "Impact",
    avatar: "🌱",
  },
  {
    id: 8,
    quote: "One of the truest tests of integrity is its blunt refusal to be compromised by temporary compromise.",
    author: "Chinua Achebe",
    role: "Literary Titan & Educator",
    tag: "Integrity",
    avatar: "📖",
  },
  {
    id: 9,
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    role: "Philosopher & Polymath",
    tag: "Discipline",
    avatar: "🏛️",
  },
  {
    id: 10,
    quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    role: "Double Nobel Laureate (Physics & Chemistry)",
    tag: "Curiosity",
    avatar: "🔬",
  },
  {
    id: 11,
    quote: "An investment in knowledge pays the best interest for generations to come.",
    author: "Benjamin Franklin",
    role: "Inventor, Statesman & Polymath",
    tag: "Wisdom",
    avatar: "⚡",
  },
  {
    id: 12,
    quote: "The roots of education are bitter, but the fruit is sweet. Persevere through the grind, celebrate the triumph.",
    author: "African Proverb & Scholastic Wisdom",
    role: "Ancient Heritage",
    tag: "Perseverance",
    avatar: "🌟",
  },
];

export default function MotivationQuoteWidget({ compact = false, autoRotate = true }) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fade, setFade] = useState(true);

  const current = MOTIVATIONAL_QUOTES[currentIndex];

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      nextQuote();
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRotate, currentIndex]);

  const nextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setFade(true);
    }, 250);
  };

  const prevQuote = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? MOTIVATIONAL_QUOTES.length - 1 : prev - 1
      );
      setFade(true);
    }, 250);
  };

  const handleCopy = () => {
    const textToCopy = `"${current.quote}" — ${current.author} (${current.role})`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `${current.quote}. By ${current.author}`
    );
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`mq-widget-container ${compact ? "mq-compact" : ""}`}>
      {/* Top Banner Bar */}
      <div className="mq-header">
        <div className="mq-header-badge">
          <span className="mq-badge-glow">✦</span>
          <span>Daily Catalyst of Excellence</span>
          <span className="mq-tag-pill">{current.tag}</span>
        </div>

        <div className="mq-controls">
          <button
            type="button"
            className="mq-btn mq-btn-icon"
            onClick={prevQuote}
            title="Previous motivational quote"
          >
            ‹
          </button>
          <button
            type="button"
            className="mq-btn mq-btn-icon"
            onClick={nextQuote}
            title="Next motivational quote"
          >
            ›
          </button>
          <button
            type="button"
            className={`mq-btn ${copied ? "mq-btn-success" : ""}`}
            onClick={handleCopy}
            title="Copy quote text"
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
          {typeof window !== "undefined" && window.speechSynthesis && (
            <button
              type="button"
              className={`mq-btn ${isSpeaking ? "mq-btn-speaking" : ""}`}
              onClick={handleSpeak}
              title="Read quote aloud"
            >
              {isSpeaking ? "⏹ Stop" : "🔊 Listen"}
            </button>
          )}
          <button
            type="button"
            className="mq-btn mq-btn-primary"
            onClick={nextQuote}
          >
            🎲 Inspire Me
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div className={`mq-body ${fade ? "mq-fade-in" : "mq-fade-out"}`}>
        <div className="mq-quote-mark">“</div>
        <p className="mq-quote-text">{current.quote}</p>
        <div className="mq-quote-meta">
          <div className="mq-author-avatar">{current.avatar}</div>
          <div>
            <div className="mq-author-name">{current.author}</div>
            <div className="mq-author-role">{current.role}</div>
          </div>
        </div>
      </div>

      {/* Mini Progress / Indicator dots */}
      <div className="mq-dots-row">
        {MOTIVATIONAL_QUOTES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`mq-dot ${currentIndex === idx ? "active" : ""}`}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentIndex(idx);
                setFade(true);
              }, 200);
            }}
            aria-label={`Go to quote ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
