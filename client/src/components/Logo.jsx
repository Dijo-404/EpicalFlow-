import React from 'react';

export default function Logo({ width = 120, height = 120, className = "" }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 340 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(90, 5) skewX(-30)">
        {/* E Top Bar */}
        <rect x="0" y="0" width="100" height="30" fill="currentColor" />
        
        {/* E Lower Stem */}
        <rect x="0" y="60" width="40" height="90" fill="currentColor" />
        
        {/* E Middle Bar (connects to F stem) */}
        <rect x="0" y="60" width="140" height="30" fill="currentColor" />
        
        {/* E Bottom Bar */}
        <rect x="0" y="120" width="100" height="30" fill="currentColor" />
        
        {/* F Stem */}
        <rect x="140" y="0" width="40" height="150" fill="currentColor" />
        
        {/* F Top Bar */}
        <rect x="140" y="0" width="100" height="30" fill="currentColor" />
        
        {/* F Middle Bar */}
        <rect x="180" y="60" width="45" height="30" fill="currentColor" />
      </g>
    </svg>
  );
}
