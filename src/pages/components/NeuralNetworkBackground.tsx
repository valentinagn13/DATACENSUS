// Componente para el fondo de red neuronal - Reutilizable
import React from "react";

export const NeuralNetworkBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-blue-700 to-slate-900"></div>
      
      {/* Neural Network Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Grid Points */}
        {Array.from({ length: 200 }, (_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const size = Math.random() * 0.3 + 0.1;
          const opacity = Math.random() * 0.6 + 0.2;
          
          return (
            <circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill="white"
              opacity={opacity}
            >
              <animate
                attributeName="opacity"
                values={`${opacity};${opacity * 0.3};${opacity}`}
                dur={`${Math.random() * 5 + 3}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
        
        {/* Connecting Lines */}
        {Array.from({ length: 150 }, (_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = x1 + (Math.random() - 0.5) * 20;
          const y2 = y1 + (Math.random() - 0.5) * 20;
          const opacity = Math.random() * 0.3 + 0.1;
          
          if (x2 < 0 || x2 > 100 || y2 < 0 || y2 > 100) return null;
          
          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="0.1"
              opacity={opacity}
            >
              <animate
                attributeName="stroke-width"
                values="0.1;0.3;0.1"
                dur={`${Math.random() * 8 + 4}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}
        
        {/* Animated Data Flow Lines */}
        {Array.from({ length: 30 }, (_, i) => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const length = Math.random() * 15 + 5;
          const angle = Math.random() * 360;
          const endX = startX + length * Math.cos((angle * Math.PI) / 180);
          const endY = startY + length * Math.sin((angle * Math.PI) / 180);
          
          return (
            <line
              key={`flow-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="url(#pulseGradient)"
              strokeWidth="0.15"
              opacity="0.4"
            >
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur={`${Math.random() * 3 + 2}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 2}s`}
              />
            </line>
          );
        })}
        
        {/* Gradient for animated lines */}
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="1">
              <animate
                attributeName="stop-color"
                values="#00FFFF; #0077FF; #00FFFF"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#0077FF" stopOpacity="1">
              <animate
                attributeName="stop-color"
                values="#0077FF; #00FFFF; #0077FF"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
      </svg>
      
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-700/5 to-slate-900/20"></div>
    </div>
  );
};
