import React from 'react';

/**
 * High-fidelity Worker Avatar component for industrial CCTV & violation records.
 * Renders an industrial worker with hardhat and safety vest.
 */
export default function WorkerAvatar({ name = "Worker", violation = false, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };

  // Deterministic color styling based on worker name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const helmetColors = ['#facc15', '#f59e0b', '#ffffff', '#38bdf8'];
  const helmetColor = violation ? '#ef4444' : helmetColors[hash % helmetColors.length];

  return (
    <div className={`relative inline-flex items-center justify-center rounded-lg overflow-hidden bg-slate-800 border ${violation ? 'border-red-500/50' : 'border-slate-700'} ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Dark factory background */}
        <rect width="64" height="64" fill="#0f172a" />
        
        {/* Safety Vest / Shoulders */}
        <path d="M12 56C12 44 20 40 32 40C44 40 52 44 52 56V64H12V56Z" fill="#eab308" />
        {/* Vest Reflective Stripes */}
        <path d="M22 40L20 64H27L28 40H22Z" fill="#f8fafc" />
        <path d="M42 40L44 64H37L36 40H42Z" fill="#f8fafc" />
        <path d="M16 52H48V56H16V52Z" fill="#f8fafc" opacity="0.9" />

        {/* Head & Neck */}
        <rect x="28" y="34" width="8" height="8" rx="2" fill="#d97706" />
        <circle cx="32" cy="27" r="10" fill="#f59e0b" />

        {/* Safety Hardhat */}
        <path d="M18 24C18 16 24 12 32 12C40 12 46 16 46 24H18Z" fill={helmetColor} />
        {/* Hardhat brim */}
        <rect x="16" y="23" width="32" height="3" rx="1.5" fill={helmetColor} />
        {/* Hardhat ridge */}
        <rect x="30" y="10" width="4" height="12" rx="1" fill="#ffffff" opacity="0.3" />

        {/* Safety Glasses / Eyes */}
        <rect x="25" y="25" width="14" height="3.5" rx="1.5" fill="#0284c7" opacity="0.8" />
      </svg>
      {violation && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900" />
      )}
    </div>
  );
}
