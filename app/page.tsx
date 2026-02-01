'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import MusicPlayer from './components/MusicPlayer';
import SuccessMeme from './components/SuccessMeme';

function FloatingHearts() {
  const heartsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (heartsRef.current) {
      heartsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      heartsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  const HeartShape = ({ position, color, scale }: { position: number[], color: string, scale: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.5;
      }
    });

    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef} position={[position[0], position[1], position[2]]} scale={scale}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.8}
          />
          {/* Heart shape using two spheres and a cone */}
          <mesh position={[-0.25, 0.3, 0]} scale={[0.6, 0.6, 0.6]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.25, 0.3, 0]} scale={[0.6, 0.6, 0.6]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]} scale={[0.6, 0.8, 0.6]}>
            <coneGeometry args={[0.5, 1, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        </mesh>
      </Float>
    );
  };

  return (
    <group ref={heartsRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <HeartShape
          key={i}
          position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 - 5]}
          color={['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff'][i % 5]}
          scale={0.5 + Math.random() * 0.5}
        />
      ))}
    </group>
  );
}

// Particle Field
function ParticleField() {
  const points = useRef<THREE.Points>(null);
  
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for(let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ff69b4" transparent opacity={0.8} />
    </points>
  );
}

export default function ValentinePage() {
  const [answered, setAnswered] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  
  // Smooth spring animation for button movement
  const buttonX = useMotionValue(0);
  const buttonY = useMotionValue(0);
  const springX = useSpring(buttonX, { stiffness: 300, damping: 20 });
  const springY = useSpring(buttonY, { stiffness: 300, damping: 20 });

  // Move NO button away from cursor - IMPOSSIBLE TO CLICK!
  const handleMouseMove = (e: React.MouseEvent) => {
    if (noButtonRef.current && !answered) {
      const rect = noButtonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      const distance = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY);
      
      // Aggressive detection radius - runs away from farther distance
      if (distance < 350) {
        const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX);
        
        // Always move at least a minimum distance plus extra based on how close
        const minEscapeDistance = 150;
        const panicDistance = Math.max(0, 350 - distance); // More panic when closer
        const moveDistance = minEscapeDistance + panicDistance * 1.5;
        
        const newX = Math.cos(angle + Math.PI) * moveDistance;
        const newY = Math.sin(angle + Math.PI) * moveDistance;
        
        // Keep button within viewport with padding
        const padding = 80;
        const maxX = window.innerWidth - rect.width - padding;
        const maxY = window.innerHeight - rect.height - padding;
        
        // Add some randomness to make it feel alive
        const randomX = (Math.random() - 0.5) * 50;
        const randomY = (Math.random() - 0.5) * 50;
        
        buttonX.set(Math.max(padding, Math.min(maxX, buttonX.get() + newX + randomX)));
        buttonY.set(Math.max(padding, Math.min(maxY, buttonY.get() + newY + randomY)));
      }
    }
  };

  const handleYesClick = () => {
    setAnswered(true);
    setTimeout(() => setShowMeme(true), 500);
  };

  return (
    <div 
      className="relative min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-red-900 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Music Player */}
      <MusicPlayer />

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ff69b4" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
          <ParticleField />
          <FloatingHearts />
        </Canvas>
      </div>

      {/* UI Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              {/* Animated Title */}
              <motion.h1 
                className="text-6xl md:text-8xl font-bold text-white mb-8 drop-shadow-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -2, 2, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  textShadow: "0 0 30px rgba(255,105,180,0.8), 0 0 60px rgba(255,105,180,0.4)"
                }}
              >
                Will You Be My
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
                  Valentine?
                </span>
              </motion.h1>

              {/* Floating subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
                className="text-xl text-pink-200 mb-16"
              >
                (You better say yes... or else 😈)
              </motion.p>

              {/* Buttons Container */}
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative h-40">
                {/* YES Button - Big and Attractive */}
                <motion.button
                  onClick={handleYesClick}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 0 50px rgba(255,20,147,0.8)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    scale: { duration: 1.5, repeat: Infinity },
                  }}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-3xl md:text-5xl font-bold py-6 px-16 rounded-full shadow-2xl border-4 border-white/30 cursor-pointer relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    YES! 💖
                    <motion.span
                      animate={{ rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      🌹
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-600"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.button>

                {/* NO Button - IMPOSSIBLE TO CLICK! */}
                <motion.button
                  ref={noButtonRef}
                  style={{ x: springX, y: springY }}
                  className="bg-gray-700 text-gray-500 text-xl font-bold py-4 px-8 rounded-full border-2 border-gray-500 select-none pointer-events-none absolute md:static"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  no... ❌
                </motion.button>
              </div>

              {/* Taunting messages */}
              <motion.div
                className="mt-12 text-pink-300 text-lg italic h-8"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                try clicking &quot;no&quot;... I dare you 😏
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              {!showMeme ? (
                <motion.h2 
                  className="text-6xl font-bold text-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  YAY! 🎉
                </motion.h2>
              ) : (
                <SuccessMeme onClose={() => setShowMeme(false)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
