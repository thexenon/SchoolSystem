import React, { useState, useEffect } from "react";
import "./DailyQuotePopupModal.css";

export const DAILY_MOTIVATION_QUOTES = [
  {
    id: 1,
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    title: "Former President of South Africa & Nobel Peace Laureate",
    origin: "🇿🇦 South Africa",
    category: "Transformation",
  },
  {
    id: 2,
    quote: "Forward ever, backward never. We face neither East nor West: we face forward.",
    author: "Osagyefo Dr. Kwame Nkrumah",
    title: "Founding Father & First President of Ghana",
    origin: "🇬🇭 Ghana",
    category: "Determination",
  },
  {
    id: 3,
    quote: "Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family.",
    author: "Kofi Annan",
    title: "7th Secretary-General of the United Nations & Nobel Peace Laureate",
    origin: "🇬🇭 Ghana / UN",
    category: "Empowerment",
  },
  {
    id: 4,
    quote: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
    author: "Albert Einstein",
    title: "Theoretical Physicist & Nobel Prize Laureate",
    origin: "🇩🇪 Germany / USA",
    category: "Wisdom",
  },
  {
    id: 5,
    quote: "You may encounter many defeats, but you must not be defeated. In fact, it may be necessary to encounter the defeats, so you can know who you are.",
    author: "Maya Angelou",
    title: "Celebrated Poet, Author & Civil Rights Activist",
    origin: "🇺🇸 United States",
    category: "Resilience",
  },
  {
    id: 6,
    quote: "Education must not simply teach work - it must teach Life.",
    author: "W.E.B. Du Bois",
    title: "Sociologist, Historian & Pan-African Civil Rights Leader",
    origin: "🇺🇸 USA / 🇬🇭 Ghana",
    category: "Purpose",
  },
  {
    id: 7,
    quote: "It's the little things citizens do. That's what will make the difference. My little thing is planting trees.",
    author: "Wangari Maathai",
    title: "Nobel Peace Laureate & Founder of Green Belt Movement",
    origin: "🇰🇪 Kenya",
    category: "Action",
  },
  {
    id: 8,
    quote: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle",
    title: "Ancient Philosopher & Polymath",
    origin: "🇬🇷 Greece",
    category: "Perseverance",
  },
  {
    id: 9,
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    title: "Statesman & Orator",
    origin: "🇬🇧 United Kingdom",
    category: "Courage",
  },
  {
    id: 10,
    quote: "The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education.",
    author: "Dr. Martin Luther King Jr.",
    title: "Civil Rights Leader & Nobel Peace Laureate",
    origin: "🇺🇸 United States",
    category: "Character",
  },
];

/**
 * DailyQuotePopupModal
 * Pops up automatically once per calendar day or immediately after login,
 * without interrupting the login interface. Can also be manually summoned anytime.
 */
export default function DailyQuotePopupModal({ forceOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [alwaysShowOnLogin, setAlwaysShowOnLogin] = useState(true);

  // Check if popup should show today or if triggered by login / forceOpen
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const lastSeenDate = localStorage.getItem("daily_quote_last_date");
    const loginTriggered = localStorage.getItem("show_daily_quote_popup") === "true";

    // Show if never seen today OR if login explicitly triggered it
    if (loginTriggered || lastSeenDate !== todayDate) {
      // Pick quote of the day based on day of month
      const dayNum = new Date().getDate();
      const quoteIdx = dayNum % DAILY_MOTIVATION_QUOTES.length;
      setCurrentIndex(quoteIdx);
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    const todayDate = new Date().toISOString().slice(0, 10);
    localStorage.setItem("daily_quote_last_date", todayDate);
    localStorage.removeItem("show_daily_quote_popup");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleShuffleQuote = () => {
    let nextIdx = Math.floor(Math.random() * DAILY_MOTIVATION_QUOTES.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % DAILY_MOTIVATION_QUOTES.length;
    }
    setCurrentIndex(nextIdx);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSpeakQuote = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const activeQuote = DAILY_MOTIVATION_QUOTES[currentIndex];
    const text = `Today's Daily Motivation. ${activeQuote.quote}. By ${activeQuote.author}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyQuote = () => {
    const activeQuote = DAILY_MOTIVATION_QUOTES[currentIndex];
    const text = `"${activeQuote.quote}" — ${activeQuote.author} (${activeQuote.title})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  if (!isOpen) return null;

  const currentQuote = DAILY_MOTIVATION_QUOTES[currentIndex];
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dq-backdrop" onClick={handleDismiss}>
      <div
        className="dq-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Glow Bar */}
        <div className="dq-top-bar">
          <div className="dq-badge-group">
            <span className="dq-sparkle-badge">✨ DAILY WORD OF WISDOM</span>
            <span className="dq-category-pill">{currentQuote.category}</span>
          </div>
          <button
            type="button"
            className="dq-close-btn"
            onClick={handleDismiss}
            aria-label="Close Daily Quote"
          >
            ×
          </button>
        </div>

        {/* Date line */}
        <div className="dq-date-line">
          <span>📅 {todayFormatted}</span>
          <span className="dq-origin-tag">{currentQuote.origin}</span>
        </div>

        {/* Quote Block */}
        <div className="dq-quote-body">
          <div className="dq-quote-mark dq-quote-left">“</div>
          <p className="dq-quote-text">{currentQuote.quote}</p>
          <div className="dq-quote-mark dq-quote-right">”</div>
        </div>

        {/* Author Attribution */}
        <div className="dq-author-card">
          <div className="dq-author-avatar">
            {currentQuote.author.slice(0, 2).toUpperCase()}
          </div>
          <div className="dq-author-details">
            <h4 className="dq-author-name">{currentQuote.author}</h4>
            <p className="dq-author-title">{currentQuote.title}</p>
          </div>
        </div>

        {/* Action Controls: Shuffle, Audio, Copy */}
        <div className="dq-actions-row">
          <button
            type="button"
            className="dq-action-btn"
            onClick={handleShuffleQuote}
            title="Read another quote"
          >
            🎲 Next Inspiration
          </button>

          <button
            type="button"
            className={`dq-action-btn ${isSpeaking ? "dq-btn-active" : ""}`}
            onClick={handleSpeakQuote}
            title="Listen to this quote"
          >
            {isSpeaking ? "⏹ Stop Audio" : "🔊 Listen"}
          </button>

          <button
            type="button"
            className="dq-action-btn"
            onClick={handleCopyQuote}
            title="Copy quote to clipboard"
          >
            {copiedToast ? "✓ Copied!" : "📋 Copy"}
          </button>
        </div>

        {/* Footer with continue button */}
        <div className="dq-footer">
          <label className="dq-remember-label">
            <input
              type="checkbox"
              checked={alwaysShowOnLogin}
              onChange={(e) => setAlwaysShowOnLogin(e.target.checked)}
            />
            <span>Pop up daily inspiration on every login</span>
          </label>

          <button
            type="button"
            className="dq-continue-btn"
            onClick={handleDismiss}
          >
            🚀 Have an Inspiring Day • Continue
          </button>
        </div>
      </div>
    </div>
  );
}
