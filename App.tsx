import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Dices, RotateCcw, Bot } from 'lucide-react';

import Die6 from './components/Die6';
import Die21 from './components/Die21';
import { DiceType, RollResult, AiFortune } from './types';
import { getRollFortune } from './services/geminiService';

const App: React.FC = () => {
  const [diceType, setDiceType] = useState<DiceType>(DiceType.D6);
  const [rollValue, setRollValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [useAi, setUseAi] = useState<boolean>(false);
  const [fortune, setFortune] = useState<AiFortune | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Sound effect placeholders (real apps would import audio files)
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: diceType === DiceType.D6 ? ['#1e293b', '#64748b', '#ffffff'] : ['#9333ea', '#c084fc', '#ffffff']
    });
  };

  const handleRoll = useCallback(async () => {
    if (isRolling) return;

    setIsRolling(true);
    setFortune(null); // Clear previous fortune

    // Animate numbers while rolling logic is handled in components visually, 
    // but we can update state rapidly for D21 "slot machine" effect if we wanted.
    // Here we mainly wait for the animation time.
    
    // Play sound logic would go here

    const rollDuration = 800; // ms matches CSS transition

    setTimeout(async () => {
      const newValue = Math.floor(Math.random() * diceType) + 1;
      setRollValue(newValue);
      setIsRolling(false);

      // Special effects for max roll
      if (newValue === diceType || newValue === 1) {
         triggerConfetti();
      }

      // AI Fortune Fetch
      if (useAi) {
        setIsAiLoading(true);
        const fortuneResult = await getRollFortune(newValue, diceType);
        setFortune(fortuneResult);
        setIsAiLoading(false);
      }

    }, rollDuration);

  }, [diceType, isRolling, useAi]);

  const toggleDiceType = () => {
    setDiceType(prev => prev === DiceType.D6 ? DiceType.D21 : DiceType.D6);
    setRollValue(1); // Reset
    setFortune(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      
      {/* Ambient Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${diceType === DiceType.D6 ? 'bg-blue-500' : 'bg-purple-600'}`}></div>

      <header className="absolute top-6 left-0 w-full flex justify-between px-6 z-20">
         <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
           Fate Roller
         </h1>
         <div className="flex items-center gap-3">
             <span className={`text-xs font-semibold uppercase tracking-wider ${useAi ? 'text-green-400' : 'text-slate-500'}`}>
               AI Oracle {useAi ? 'ON' : 'OFF'}
             </span>
             <button 
               onClick={() => setUseAi(!useAi)}
               className={`p-2 rounded-full transition-all duration-300 ${useAi ? 'bg-green-500/20 text-green-400 ring-2 ring-green-500/50' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
               title="Toggle AI Interpretation"
             >
               <Bot size={20} />
             </button>
         </div>
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

        {/* Oracle Message */}
        <div className="min-h-[80px] w-full px-4 flex items-center justify-center">
          {isAiLoading ? (
             <div className="flex items-center gap-2 text-slate-400 animate-pulse">
               <Sparkles size={16} />
               <span className="text-sm">Consulting the stars...</span>
             </div>
          ) : fortune ? (
            <div className={`text-center p-4 rounded-lg border backdrop-blur-sm transition-all animate-in fade-in slide-in-from-bottom-4 duration-500
              ${fortune.tone === 'lucky' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200' : 
                fortune.tone === 'ominous' ? 'bg-red-500/10 border-red-500/30 text-red-200' : 
                'bg-slate-700/30 border-slate-600 text-slate-200'}
            `}>
               <p className="text-lg font-medium font-serif italic">"{fortune.text}"</p>
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic">Roll to reveal your fate...</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 w-full px-4">
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
         <p>Powered by React & Gemini 2.5</p>
      </footer>
    </div>
  );
};

export default App;