import React, { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Dices, RotateCcw } from 'lucide-react';

import Die6 from './components/Die6';
import Die21 from './components/Die21';
import { DiceType } from './types';

const App: React.FC = () => {
  const [diceType, setDiceType] = useState<DiceType>(DiceType.D6);
  const [rollValue, setRollValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Sound effect placeholders (real apps would import audio files)
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: diceType === DiceType.D6 ? ['#1e293b', '#64748b', '#ffffff'] : ['#9333ea', '#c084fc', '#ffffff']
    });
  };

  const handleRoll = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);
    
    // Animate numbers while rolling logic is handled in components visually
    const rollDuration = 800; // ms matches CSS transition

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * diceType) + 1;
      setRollValue(newValue);
      setIsRolling(false);

      // Special effects for max roll
      if (newValue === diceType || newValue === 1) {
         triggerConfetti();
      }
    }, rollDuration);

  }, [diceType, isRolling]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      
      {/* Ambient Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${diceType === DiceType.D6 ? 'bg-blue-500' : 'bg-purple-600'}`}></div>

      <header className="absolute top-6 left-0 w-full flex justify-center px-6 z-20">
         <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
           Fate Roller
         </h1>
      </header>

      {/* Main Game Area */}
      <main className="relative z-10 flex flex-col items-center gap-12 w-full max-w-md">
        
        {/* Dice Container */}
        <div className="h-[250px] flex items-center justify-center w-full">
           {diceType === DiceType.D6 ? (
             <Die6 value={rollValue} isRolling={isRolling} />
           ) : (
             <Die21 value={rollValue} isRolling={isRolling} />
           )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 w-full px-4 mt-8">
           {/* Roll Button */}
           <button
             onClick={handleRoll}
             disabled={isRolling}
             className={`
               group relative w-full h-16 rounded-xl font-bold text-xl tracking-widest uppercase transition-all duration-200
               flex items-center justify-center gap-3 overflow-hidden shadow-lg hover:shadow-2xl active:scale-95
               ${diceType === DiceType.D6 
                  ? 'bg-slate-100 text-slate-900 hover:bg-white shadow-slate-900/20' 
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/40'}
               disabled:opacity-70 disabled:cursor-not-allowed
             `}
           >
             {isRolling ? (
               <RotateCcw className="animate-spin" size={24} />
             ) : (
               <>
                 <Dices size={24} className={`transition-transform group-hover:rotate-12`} />
                 <span>Roll</span>
               </>
             )}
           </button>

           {/* Switch Toggle */}
           <div className="flex items-center justify-center gap-4 p-1 bg-slate-800/50 rounded-lg backdrop-blur-md border border-slate-700/50 self-center">
              <button
                onClick={() => setDiceType(DiceType.D6)}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${diceType === DiceType.D6 ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Classic D6
              </button>
              <button
                 onClick={() => setDiceType(DiceType.D21)}
                 className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${diceType === DiceType.D21 ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Mystic D21
              </button>
           </div>
        </div>
      </main>

      <footer className="absolute bottom-4 text-slate-600 text-xs text-center w-full">
         <p>Powered by React</p>
      </footer>
    </div>
  );
};

export default App;