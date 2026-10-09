import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { DeckBoxMesh } from './DeckBoxMesh';
import { CardMesh } from './CardMesh';
import { soundFx } from '../../utils/sound';
import { Sparkles, Layers } from 'lucide-react';

// Flickering Candlelight Rig
const CandleLightRig = () => {
  const lightRef1 = useRef();
  const lightRef2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Organic candle flicker simulation
    if (lightRef1.current) {
      const flicker1 = Math.sin(t * 7) * 0.08 + Math.cos(t * 13) * 0.05 + Math.sin(t * 23) * 0.03;
      lightRef1.current.intensity = 16 + flicker1 * 5;
    }
    if (lightRef2.current) {
      const flicker2 = Math.cos(t * 9) * 0.06 + Math.sin(t * 17) * 0.04;
      lightRef2.current.intensity = 10 + flicker2 * 4;
    }
  });

  return (
    <>
      <ambientLight color="#FAF3E0" intensity={0.45} />
      
      {/* Primary Warm Candle Light (Upper Left) */}
      <pointLight
        ref={lightRef1}
        position={[-2.2, 2.4, 2.5]}
        color="#E0A96D"
        intensity={16}
        distance={9}
        decay={2}
        castShadow
        shadow-bias={-0.001}
      />

      {/* Secondary Rim Candle Light (Lower Right) */}
      <pointLight
        ref={lightRef2}
        position={[2.4, -0.6, 2.0]}
        color="#D48C46"
        intensity={10}
        distance={7}
        decay={2}
      />

      {/* Subtle Front Fill */}
      <directionalLight
        position={[0, 3, 4]}
        color="#FAF3E0"
        intensity={0.35}
      />
    </>
  );
};

// 3D Scene Contents
const SceneContent = ({ onSelectLevel, isOpen, setIsOpen }) => {
  const [animationStage, setAnimationStage] = useState(isOpen ? 'fanned' : 'closed');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [boxHovered, setBoxHovered] = useState(false);

  const handleBoxClick = () => {
    if (!isOpen) {
      soundFx.playBoxOpen();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([20, 45, 25]);
      }
      setIsOpen(true);
      setAnimationStage('opening');
      setTimeout(() => {
        setAnimationStage('fanned');
      }, 340);
    }
  };

  const handleCardClick = (levelId) => {
    if (selectedLevelId) return;
    setSelectedLevelId(levelId);
    soundFx.playCardDraw();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Smooth transition into the game
    setTimeout(() => {
      onSelectLevel(levelId);
    }, 650);
  };

  // 3D Cards Fan Data
  const levelCardsData = [
    {
      id: 1,
      name: 'Легкий',
      badge: 'Уровень 1',
      cardsCount: 35,
      accentColor: '#E0A96D',
      description: 'Привычки, детство, еда и уютные мелочи.',
      fanPos: [-1.02, 0.42, 0.25],
      fanRot: [0, 0.15, 0.1],
      scale: 0.84,
    },
    {
      id: 2,
      name: 'Средний',
      badge: 'Уровень 2',
      cardsCount: 35,
      accentColor: '#E29578',
      description: 'Ценности, мечты, доверие и взгляды.',
      fanPos: [0, 0.65, 0.55],
      fanRot: [0, 0, 0],
      scale: 0.92,
    },
    {
      id: 3,
      name: 'Сложный',
      badge: 'Уровень 3',
      cardsCount: 35,
      accentColor: '#D48C46',
      description: 'Романтика, секреты, страсти и притяжение.',
      fanPos: [1.02, 0.42, 0.25],
      fanRot: [0, -0.15, -0.1],
      scale: 0.84,
    },
  ];

  return (
    <>
      <CandleLightRig />

      {/* Gentle Floating Motion in Idle State */}
      <Float
        speed={isOpen ? 1 : 2}
        rotationIntensity={isOpen ? 0.05 : 0.22}
        floatIntensity={isOpen ? 0.1 : 0.35}
        floatingRange={[-0.07, 0.07]}
      >
        <group position={[0, -0.15, 0]}>
          {/* ======================================================== */}
          {/* 3D DECK BOX */}
          {/* ======================================================== */}
          <DeckBoxMesh
            isOpen={isOpen}
            onClick={handleBoxClick}
            onPointerOver={() => setBoxHovered(true)}
            onPointerOut={() => setBoxHovered(false)}
            isHovered={boxHovered}
          />

          {/* ======================================================== */}
          {/* 3D CARDS FANNING OUT OF THE BOX */}
          {/* ======================================================== */}
          {levelCardsData.map((lvl) => {
            const isSelected = selectedLevelId === lvl.id;
            const isOtherSelected = selectedLevelId && !isSelected;

            let targetPos;
            let targetRot;

            if (!isOpen || animationStage === 'closed') {
              targetPos = [0, -0.6, -0.05];
              targetRot = [0, 0, 0];
            } else if (animationStage === 'opening') {
              targetPos = [0, 0.45, 0.15];
              targetRot = [0.15, 0, 0];
            } else if (isSelected) {
              targetPos = [0, 0.55, 2.1];
              targetRot = [0, 0, 0];
            } else if (isOtherSelected) {
              targetPos = [lvl.fanPos[0] * 1.5, lvl.fanPos[1] - 0.4, lvl.fanPos[2] - 0.9];
              targetRot = lvl.fanRot;
            } else {
              targetPos = lvl.fanPos;
              targetRot = lvl.fanRot;
            }

            return (
              <CardMesh
                key={lvl.id}
                level={lvl}
                isOpen={isOpen}
                animationStage={animationStage}
                targetPosition={targetPos}
                targetRotation={targetRot}
                isHovered={hoveredCard === lvl.id && !selectedLevelId}
                isSelected={isSelected}
                scale={lvl.scale}
                onClick={() => {
                  if (isOpen && animationStage === 'fanned') {
                    handleCardClick(lvl.id);
                  } else {
                    handleBoxClick();
                  }
                }}
                onPointerOver={() => {
                  if (isOpen && animationStage === 'fanned') setHoveredCard(lvl.id);
                }}
                onPointerOut={() => setHoveredCard(null)}
              />
            );
          })}
        </group>
      </Float>

      {/* Soft Contact Shadows on the Table */}
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.75}
        scale={6}
        blur={2.4}
        far={4.5}
        color="#0A0806"
      />
    </>
  );
};

export const DeckBoxScene = ({ onSelectLevel, activeLevel }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      {/* Top 3D interaction hint */}
      {!isOpen && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="py-1.5 px-3.5 rounded-full bg-candle-amber/15 border border-candle-amber/30 text-candle-amber text-[11px] font-semibold tracking-wide flex items-center gap-1.5 shadow-candle-glow animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span>Коснитесь декбокса, чтобы открыть</span>
          </div>
        </div>
      )}

      {/* True WebGL 3D Canvas with responsive perspective */}
      <div className="w-full flex-1 touch-none">
        <Canvas
          shadows
          camera={{ position: [0, 0.25, 5.8], fov: 44 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <SceneContent
            onSelectLevel={onSelectLevel}
            activeLevel={activeLevel}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Canvas>
      </div>

      {/* Bottom Option: "Все уровни" button when fanned out */}
      {isOpen && (
        <div className="w-full max-w-xs mx-auto pb-4 z-30 flex justify-center animate-fade-in">
          <button
            onClick={() => onSelectLevel('all')}
            className="py-2.5 px-5 rounded-2xl bg-candle-card/90 hover:bg-candle-card text-candle-cream border border-candle-amber/40 hover:border-candle-amber text-xs font-semibold tracking-wide flex items-center gap-2 shadow-card-warm active:scale-95 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-candle-amber" />
            <span>Играть всеми 105 картами</span>
          </button>
        </div>
      )}
    </div>
  );
};
