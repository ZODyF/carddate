import React from 'react';

export const AppLogo = ({ className = "w-6 h-6", glow = true }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 rounded-full bg-candle-amber/20 blur-md pointer-events-none" />
      )}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoCardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A332C" />
            <stop offset="100%" stopColor="#221D19" />
          </linearGradient>
          <linearGradient id="logoCardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A4036" />
            <stop offset="100%" stopColor="#2A241F" />
          </linearGradient>
          <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D09D" />
            <stop offset="50%" stopColor="#E0A96D" />
            <stop offset="100%" stopColor="#C97B34" />
          </linearGradient>
        </defs>

        {/* Back card (tilted left) */}
        <rect
          x="6"
          y="7"
          width="18"
          height="24"
          rx="4.5"
          transform="rotate(-12 15 19)"
          fill="url(#logoCardGrad1)"
          stroke="#55473A"
          strokeWidth="1.2"
        />

        {/* Front card (tilted right) */}
        <rect
          x="12"
          y="6"
          width="18"
          height="24"
          rx="4.5"
          transform="rotate(10 21 18)"
          fill="url(#logoCardGrad2)"
          stroke="url(#logoGold)"
          strokeWidth="1.3"
        />

        {/* Inner frame on front card */}
        <rect
          x="13.5"
          y="7.5"
          width="15"
          height="21"
          rx="3.5"
          transform="rotate(10 21 18)"
          stroke="#E0A96D"
          strokeOpacity="0.3"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Center glowing Heart / Flame emblem */}
        <path
          d="M21 13.5C21 13.5 17 10 14.5 12.5C12 15 13.5 19 21 23C28.5 19 30 15 27.5 12.5C25 10 21 13.5 21 13.5Z"
          fill="url(#logoGold)"
          opacity="0.95"
        />
        {/* Subtle candle spark in heart */}
        <circle cx="21" cy="16" r="1.8" fill="#FAF3E0" />
      </svg>
    </div>
  );
};
