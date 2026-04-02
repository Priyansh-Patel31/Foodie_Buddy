export default function AnimatedLogo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative w-10 h-10 shrink-0">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <style>{`
            @keyframes orbitA {
              0%   { transform: rotate(0deg)   translateX(10px) rotate(0deg); }
              100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
            }
            @keyframes orbitB {
              0%   { transform: rotate(120deg)  translateX(10px) rotate(-120deg); }
              100% { transform: rotate(480deg)  translateX(10px) rotate(-480deg); }
            }
            @keyframes orbitC {
              0%   { transform: rotate(240deg)  translateX(10px) rotate(-240deg); }
              100% { transform: rotate(600deg)  translateX(10px) rotate(-600deg); }
            }
            @keyframes pulse-core {
              0%, 100% { opacity: 1;    transform: scale(1); }
              50%       { opacity: 0.85; transform: scale(1.15); }
            }
            @keyframes spin-ring     { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
            @keyframes spin-ring-rev { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
            @keyframes emoji-bob {
              0%, 100% { transform: translateY(0px) scale(1); }
              50%       { transform: translateY(-1px) scale(1.05); }
            }
            .dot-a { animation: orbitA 3s linear infinite; transform-origin: 20px 20px; }
            .dot-b { animation: orbitB 3s linear infinite; transform-origin: 20px 20px; }
            .dot-c { animation: orbitC 3s linear infinite; transform-origin: 20px 20px; }
            .core  { animation: pulse-core 2.2s ease-in-out infinite; transform-origin: 20px 20px; }
            .ring1 { animation: spin-ring 8s linear infinite; transform-origin: 20px 20px; }
            .ring2 { animation: spin-ring-rev 5s linear infinite; transform-origin: 20px 20px; }
            .pizza { animation: emoji-bob 2.2s ease-in-out infinite; transform-origin: 20px 20px; }
          `}</style>

          {/* Rings */}
          <circle className="ring1" cx="20" cy="20" r="16" stroke="#f97316" strokeWidth="0.7" strokeDasharray="3 4" opacity="0.45" />
          <circle className="ring2" cx="20" cy="20" r="11" stroke="#fb923c" strokeWidth="0.6" strokeDasharray="2 5" opacity="0.3" />

          {/* Orbiting dots */}
          <circle className="dot-a" cx="20" cy="20" r="2.4" fill="#f97316" />
          <circle className="dot-b" cx="20" cy="20" r="2.4" fill="#fb923c" />
          <circle className="dot-c" cx="20" cy="20" r="2.4" fill="#fdba74" />

          {/* Core glow */}
          <circle className="core" cx="20" cy="20" r="6.5" fill="url(#coreGrad)" />

          {/* Pizza slice inside core */}
          <g className="pizza">
            {/* crust */}
            <path d="M17.3 18.8 Q20 15.8 22.7 18.8 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.35" />
            {/* body */}
            <path d="M17.3 18.8 L20 24.2 L22.7 18.8 Q20 15.8 17.3 18.8 Z" fill="#fcd34d" stroke="#d97706" strokeWidth="0.3" />
            {/* cheese */}
            <path d="M17.7 19.4 L20 23.4 L22.3 19.4 Q20 17.2 17.7 19.4 Z" fill="#fef9c3" opacity="0.75" />
            {/* pepperoni */}
            <circle cx="19.2" cy="20.6" r="0.72" fill="#ef4444" opacity="0.9" />
            <circle cx="20.9" cy="21.5" r="0.66" fill="#ef4444" opacity="0.9" />
            <circle cx="20.1" cy="19.6" r="0.55" fill="#dc2626" opacity="0.9" />
          </g>

          <defs>
            <radialGradient id="coreGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className="text-lg font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          foodie
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase -mt-0.5">
          buddy
        </span>
      </div>
    </div>
  );
}
