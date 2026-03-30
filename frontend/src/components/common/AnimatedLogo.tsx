import { motion } from 'framer-motion';

export default function AnimatedLogo() {
  return (
    <div className="flex items-center gap-3 group relative cursor-pointer">
      {/* 3D Animated Abstract Icon */}
      <div className="relative w-12 h-12 flex items-center justify-center perspective-[1000px]">
        {/* Background glow pulse */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary-500/30 blur-xl rounded-full"
        />

        {/* Outer Rotating Ring (Sci-fi orbit) */}
        <motion.div
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full border border-primary-400/50 rounded-full box-border"
          style={{ transformStyle: 'preserve-3d' }}
        />
        
        {/* Inner Abstract Hexagon/Cube (3D Glass) */}
        <motion.div
          animate={{
            rotateZ: [0, 360],
            rotateX: [20, 40, 20],
            rotateY: [-20, -40, -20],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="relative w-8 h-8 font-black flex items-center justify-center text-white bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.6)] backdrop-blur-md overflow-hidden border border-white/20"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* F inner letter abstract shape */}
          <span className="relative z-10 text-xl font-outfit drop-shadow-md">F</span>
          
          {/* Glass glare effect inside */}
          <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent transform -skew-y-12 translate-y-[-10px]"></div>
        </motion.div>
      </div>

      {/* Sci-Fi Text with 3D Pop/Neon Effect */}
      <div className="hidden sm:flex flex-col relative">
        <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 font-outfit relative z-10">
          Foodie-Buddy
        </span>
        {/* Subtle high-tech underline animation */}
        <motion.div 
          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-transparent"
          initial={{ width: '0%' }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
