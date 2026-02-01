'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Hide hint after 5 seconds
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Use a romantic music URL - Beautiful Piano Love Song
        audioRef.current.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-piano-100-bpm-121529.mp3';
        audioRef.current.play().catch(() => {
          // Autoplay blocked, user needs to click
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showHint && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
          >
            🎵 Click for music!
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors ${
          isPlaying 
            ? 'bg-pink-500 text-white animate-pulse' 
            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
        }`}
      >
        {isPlaying ? '🎶' : '🎵'}
      </motion.button>
      
      {isPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-lg hover:bg-white/30 transition-colors"
        >
          {isMuted ? '🔇' : '🔊'}
        </motion.button>
      )}
      
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-1 items-end h-6"
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-pink-400 rounded-full"
              animate={{
                height: [8, 24, 8],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
