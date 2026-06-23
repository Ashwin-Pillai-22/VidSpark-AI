
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]`}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Glow Circle */}
      <circle cx="50" cy="50" r="48" stroke="url(#logo-gradient)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
      
      {/* Play Button Shape */}
      <path 
        d="M35 25C35 22.2386 37.2386 20 40 20H75C77.7614 20 80 22.2386 80 25V75C80 77.7614 77.7614 80 75 80H40C37.2386 80 35 77.7614 35 75V25Z" 
        fill="url(#logo-gradient)" 
        fillOpacity="0.1"
      />
      
      {/* Main Bolt Icon */}
      <path 
        d="M58 10L32 52H52L42 90L68 48H48L58 10Z" 
        fill="url(#logo-gradient)"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Accent Circles */}
      <circle cx="80" cy="20" r="4" fill="#EF4444" className="animate-pulse" />
      <circle cx="20" cy="80" r="3" fill="#A855F7" opacity="0.6" />
    </svg>
  );
};

export default Logo;
