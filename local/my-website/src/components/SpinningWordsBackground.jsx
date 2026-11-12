import React, { useState } from "react";
import "./SpinningWordsBackground.css";

const ORBIT_WORDS_RING_1 = [
  "EXCELLENCE",
  "KNOWLEDGE",
  "INNOVATION",
  "LEADERSHIP",
  "DISCIPLINE",
  "WISDOM",
  "SCHOLARSHIP",
  "INTEGRITY",
];

const ORBIT_WORDS_RING_2 = [
  "CURIOSITY",
  "PERSEVERANCE",
  "COLLABORATION",
  "AMBITION",
  "CREATIVITY",
  "CHARACTER",
  "DILIGENCE",
  "IMPACT",
];

const FLOATING_CHIPS = [
  { text: "✦ Knowledge is Power", top: "12%", left: "8%", delay: "0s", dur: "18s" },
  { text: "✦ Strive for Excellence", top: "25%", right: "10%", delay: "2s", dur: "22s" },
  { text: "✦ Lead with Character", top: "70%", left: "6%", delay: "4s", dur: "20s" },
  { text: "✦ Innovate & Inspire", top: "82%", right: "8%", delay: "1s", dur: "24s" },
  { text: "✦ Lifelong Learner", top: "45%", left: "3%", delay: "3s", dur: "19s" },
  { text: "✦ Focus & Conquer", top: "55%", right: "4%", delay: "5s", dur: "21s" },
];

export default function SpinningWordsBackground({ speed = "normal", showControlBadge = true }) {
  const [currentSpeed, setCurrentSpeed] = useState(speed); // "slow", "normal", "fast", "paused"
  const [isPaused, setIsPaused] = useState(false);

  const speedClass = isPaused
    ? "speed-paused"
    : currentSpeed === "fast"
    ? "speed-fast"
    : currentSpeed === "slow"
    ? "speed-slow"
    : "speed-normal";

  const cycleSpeed = () => {
    if (currentSpeed === "normal") setCurrentSpeed("fast");
    else if (currentSpeed === "fast") setCurrentSpeed("slow");
    else setCurrentSpeed("normal");
  };

  return (
    <div className={`sw-bg-container ${speedClass}`} aria-hidden="true">
      {/* Radial ambient glow orbs */}
      <div className="sw-ambient-orb sw-orb-1" />
      <div className="sw-ambient-orb sw-orb-2" />
      <div className="sw-ambient-orb sw-orb-3" />

      {/* 3D Perspective Orbit Stage */}
      <div className="sw-perspective-stage">
        {/* Ring 1 - Clockwise Slow Spin */}
        <div className="sw-orbit-ring sw-orbit-ring-outer">
          <div className="sw-orbit-track sw-track-clockwise">
            {ORBIT_WORDS_RING_1.concat(ORBIT_WORDS_RING_1).map((word, i) => (
              <span key={`r1-${i}`} className="sw-orbit-word sw-word-cyan">
                {word} <span className="sw-word-dot">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Ring 2 - Counter-Clockwise Inner Spin */}
        <div className="sw-orbit-ring sw-orbit-ring-inner">
          <div className="sw-orbit-track sw-track-counter">
            {ORBIT_WORDS_RING_2.concat(ORBIT_WORDS_RING_2).map((word, i) => (
              <span key={`r2-${i}`} className="sw-orbit-word sw-word-gold">
                {word} <span className="sw-word-dot">★</span>
              </span>
            ))}
          </div>
        </div>

        {/* Diagonal Rotating Typography Ribbon */}
        <div className="sw-ribbon sw-ribbon-left">
          <div className="sw-ribbon-scroll">
            <span>DEDICATION • PASSION • RESILIENCE • TRIUMPH • MASTERY • EMPOWERMENT • </span>
            <span>DEDICATION • PASSION • RESILIENCE • TRIUMPH • MASTERY • EMPOWERMENT • </span>
          </div>
        </div>

        <div className="sw-ribbon sw-ribbon-right">
          <div className="sw-ribbon-scroll sw-ribbon-reverse">
            <span>FUTURE LEADERS • CRITICAL THINKING • GLOBAL EXCELLENCE • ETHICS • </span>
            <span>FUTURE LEADERS • CRITICAL THINKING • GLOBAL EXCELLENCE • ETHICS • </span>
          </div>
        </div>
      </div>

      {/* Floating Motivational Keywords */}
      <div className="sw-floating-layer">
        {FLOATING_CHIPS.map((chip, idx) => (
          <div
            key={idx}
            className="sw-floating-chip"
            style={{
              top: chip.top,
              left: chip.left,
              right: chip.right,
              animationDelay: chip.delay,
              animationDuration: chip.dur,
            }}
          >
            {chip.text}
          </div>
        ))}
      </div>

      {/* Interactive Floating Speed Controller Widget */}
      {showControlBadge && (
        <div className="sw-speed-pill" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="sw-pill-btn"
            onClick={cycleSpeed}
            title="Click to change spinning background speed"
          >
            <span>🌀 Spinning Aura:</span>
            <span className="sw-pill-badge">{currentSpeed.toUpperCase()}</span>
          </button>
          <button
            type="button"
            className={`sw-pause-btn ${isPaused ? "active" : ""}`}
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume rotation" : "Pause rotation"}
          >
            {isPaused ? "▶ Play" : "❚❚ Pause"}
          </button>
        </div>
      )}
    </div>
  );
}
