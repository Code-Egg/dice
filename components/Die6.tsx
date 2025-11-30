import React, { useMemo } from 'react';

interface Die6Props {
  value: number;
  isRolling: boolean;
}

const Pip = () => <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-slate-900 shadow-inner" />;

const Face = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <div className={`absolute w-[100px] h-[100px] md:w-[160px] md:h-[160px] bg-white border-2 border-slate-200 rounded-xl md:rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] flex items-center justify-center backface-hidden ${className}`}>
    {children}
  </div>
);

const Die6: React.FC<Die6Props> = ({ value, isRolling }) => {
  
  // Calculate final rotation based on value
  // These rotations align the cube faces to the front view
  const getRotation = (val: number) => {
    switch (val) {
      case 1: return { x: 0, y: 0 };
      case 2: return { x: 0, y: 180 }; // Back is usually 6, bottom is 2. Let's align to standard layout. 
      // Layout assumed: Front=1, Back=2, Right=3, Left=4, Top=5, Bottom=6 (just for mapping simplicity)
      // Actually standard dice: Opposite sides add to 7. 
      // Front(1) - Back(6)
      // Top(5) - Bottom(2)
      // Right(3) - Left(4)
      // CSS Transforms setup in global css:
      // face-1 (F), face-2 (B), face-3 (R), face-4 (L), face-5 (T), face-6 (Bottom)
      // So...
      // To show 1 (Front): rotate(0,0)
      // To show 6 (Back): rotateY(180)
      // To show 3 (Right): rotateY(-90)
      // To show 4 (Left): rotateY(90)
      // To show 5 (Top): rotateX(-90)
      // To show 2 (Bottom): rotateX(90)
      
      // Mapped to standard opposites logic:
      case 1: return { x: 0, y: 0 };    // Front
      case 6: return { x: 0, y: 180 };  // Back
      case 3: return { x: 0, y: -90 };  // Right
      case 4: return { x: 0, y: 90 };   // Left
      case 5: return { x: -90, y: 0 };  // Top
      case 2: return { x: 90, y: 0 };   // Bottom
      default: return { x: 0, y: 0 };
    }
  };

  const targetRotation = useMemo(() => getRotation(value), [value]);

  // Add extra spins if rolling
  const currentRotation = isRolling 
    ? { x: 720 + Math.random() * 360, y: 720 + Math.random() * 360 } // Spin wildly
    : targetRotation;

  return (
    <div className="perspective-1000 w-[100px] h-[100px] md:w-[160px] md:h-[160px] mx-auto">
      <div
        className="relative w-full h-full transform-style-3d transition-transform duration-[800ms] ease-out"
        style={{
          transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`,
        }}
      >
        {/* Face 1 */}
        <Face className="face-1">
          <Pip />
        </Face>

        {/* Face 2 (Bottom) - 2 Pips */}
        <Face className="face-6">
           <div className="flex gap-4 md:gap-8 transform rotate-90">
             <Pip /><Pip />
           </div>
        </Face>

        {/* Face 3 (Right) - 3 Pips */}
        <Face className="face-3">
          <div className="flex flex-col gap-1 md:gap-2 transform -rotate-90">
             <div className="flex justify-end"><Pip /></div>
             <div className="flex justify-center"><Pip /></div>
             <div className="flex justify-start"><Pip /></div>
          </div>
        </Face>

        {/* Face 4 (Left) - 4 Pips */}
        <Face className="face-4">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <Pip /><Pip /><Pip /><Pip />
          </div>
        </Face>

        {/* Face 5 (Top) - 5 Pips */}
        <Face className="face-5">
          <div className="relative w-full h-full p-4 md:p-6 flex flex-col justify-between">
            <div className="flex justify-between"><Pip /><Pip /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Pip /></div>
            <div className="flex justify-between"><Pip /><Pip /></div>
          </div>
        </Face>

        {/* Face 6 (Back) - 6 Pips */}
        <Face className="face-2">
           <div className="grid grid-cols-2 gap-x-4 gap-y-1 md:gap-x-8 md:gap-y-2">
            <Pip /><Pip /><Pip /><Pip /><Pip /><Pip />
          </div>
        </Face>
      </div>
    </div>
  );
};

export default Die6;