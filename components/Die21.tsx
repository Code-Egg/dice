import React from 'react';

interface Die21Props {
  value: number;
  isRolling: boolean;
}

const Die21: React.FC<Die21Props> = ({ value, isRolling }) => {
  return (
    <div className="relative w-[140px] h-[140px] md:w-[200px] md:h-[200px] flex items-center justify-center mx-auto">
      {/* Outer Glow Ring */}
      <div className={`absolute inset-0 rounded-full border-4 border-purple-500/30 transition-all duration-300 ${isRolling ? 'scale-110 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}></div>
      
      {/* Spinning Polygon Background */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-[1000ms] ease-out ${isRolling ? 'rotate-[720deg]' : 'rotate-0'}`}
      >
         <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <defs>
               <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#9333ea', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#4c1d95', stopOpacity:1}} />
               </linearGradient>
            </defs>
            {/* A fancy hepta-star-like shape to represent mystical D21 */}
            <path 
              d="M50 5 L63 35 L95 35 L70 55 L80 85 L50 70 L20 85 L30 55 L5 35 L37 35 Z" 
              fill="url(#grad1)" 
              stroke="#e9d5ff" 
              strokeWidth="1.5"
            />
         </svg>
      </div>

      {/* Number Display */}
      <div className={`relative z-10 font-black text-4xl md:text-6xl text-white transition-opacity duration-200 ${isRolling ? 'opacity-0' : 'opacity-100'}`}>
        <span className="drop-shadow-lg">{value}</span>
      </div>

      {/* Blur effect for number while rolling */}
      <div className={`absolute z-10 font-black text-4xl md:text-6xl text-purple-200 blur-sm transition-opacity duration-200 ${isRolling ? 'opacity-100' : 'opacity-0'}`}>
        ?
      </div>
    </div>
  );
};

export default Die21;