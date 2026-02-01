'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface SuccessMemeProps {
  onClose: () => void;
}

export default function SuccessMeme({ onClose }: SuccessMemeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border-4 border-pink-500 max-w-md w-full mx-4 relative overflow-hidden"
    >
      {/* Sparkle background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${10 + Math.random() * 20}px`
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10"
      >
        {/* Meme Image */}
        <motion.div 
          className="relative w-full h-64 mb-4 rounded-2xl overflow-hidden border-4 border-pink-400 shadow-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGtxdHRiM2FkbWZvM3JhMXVvbWhzbm3jaW5kZ2xzeTZ4Y3I1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRv0ThflsHCqDrG/giphy.gif"
            alt="Happy Valentine Bear"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <motion.div 
            className="absolute bottom-2 left-0 right-0 text-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-4xl drop-shadow-lg">🐻💕</span>
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.h2 
          className="text-4xl font-bold text-white mb-3 text-center"
          animate={{ 
            scale: [1, 1.05, 1],
            textShadow: [
              "0 0 20px rgba(255,105,180,0.5)",
              "0 0 40px rgba(255,105,180,0.8)",
              "0 0 20px rgba(255,105,180,0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SHE SAID YES! 💖
        </motion.h2>

        {/* Funny Valentine Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 p-4 rounded-xl mb-4 border border-pink-400/30"
        >
          <p className="text-xl text-pink-100 text-center font-bold italic">
            &quot;I don&apos;t always get a Valentine,
            <br />
            but when I do...
            <span className="text-yellow-300"> it&apos;s YOU!&quot;</span>
          </p>
        </motion.div>

        {/* Developer Poem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-black/40 p-4 rounded-xl mb-4"
        >
          <p className="text-white text-center text-base leading-relaxed">
            <span className="text-pink-400">Roses</span> are red,{' '}
            <span className="text-blue-400">violets</span> are blue,
            <br />
            I built this for you
            <br />
            because I love you!❤️
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-pink-500/50 transition-shadow"
          >
            Yay! 🎉
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Create confetti explosion
              const colors = ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff'];
              for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = '50%';
                confetti.style.top = '50%';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                document.body.appendChild(confetti);
                
                const angle = (Math.random() * Math.PI * 2);
                const velocity = 200 + Math.random() * 300;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                confetti.animate([
                  { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                  { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                ], {
                  duration: 1000 + Math.random() * 500,
                  easing: 'cubic-bezier(0, .9, .57, 1)',
                }).onfinish = () => confetti.remove();
              }
            }}
            className="px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow"
          >
            🎊
          </motion.button>
        </div>
      </motion.div>
      
      {/* Floating hearts around meme */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl pointer-events-none"
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            y: -150,
            x: (Math.random() - 0.5) * 300,
            rotate: (Math.random() - 0.5) * 360
          }}
          transition={{ 
            duration: 3,
            delay: i * 0.15,
            repeat: Infinity
          }}
          style={{
            left: `${50 + (Math.random() - 0.5) * 60}%`,
            top: "60%"
          }}
        >
          {['💖', '🌹', '✨', '🦋', '🎀', '💕', '💝', '🌸'][i % 8]}
        </motion.div>
      ))}
    </motion.div>
  );
}
