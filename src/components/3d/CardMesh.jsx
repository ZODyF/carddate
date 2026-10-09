import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Heart, Flame, Layers } from 'lucide-react';

export const CardMesh = ({
  level,
  targetPosition,
  targetRotation,
  isHovered,
  isSelected,
  isOpen,
  animationStage = 'fanned', // 'closed' | 'opening' | 'fanned'
  onClick,
  onPointerOver,
  onPointerOut,
  scale = 1,
}) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const lerpSpeed = 7 * delta;

    // Smooth position lerp
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosition[0], lerpSpeed);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosition[1], lerpSpeed);
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      targetPosition[2] + (isHovered ? 0.2 : 0) + (isSelected ? 0.7 : 0),
      lerpSpeed
    );

    // Smooth rotation lerp
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation[0], lerpSpeed);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation[1], lerpSpeed);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotation[2], lerpSpeed);

    // Smooth scale lerp (hidden when closed)
    const effectiveScale = !isOpen
      ? 0.0001
      : scale * (isHovered ? 1.05 : 1) * (isSelected ? 1.15 : 1);

    meshRef.current.scale.lerp(new THREE.Vector3(effectiveScale, effectiveScale, effectiveScale), lerpSpeed);
  });

  const getLevelIcon = () => {
    switch (level.id) {
      case 1:
        return <Sparkles className="w-4 h-4 text-[#E0A96D]" />;
      case 2:
        return <Heart className="w-4 h-4 text-[#E29578]" />;
      case 3:
        return <Flame className="w-4 h-4 text-[#D48C46]" />;
      default:
        return <Layers className="w-4 h-4 text-[#E0A96D]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <group
      ref={meshRef}
      position={targetPosition}
      rotation={targetRotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.();
      }}
      onPointerOut={() => onPointerOut?.()}
    >
      {/* 3D Physical Card Slab (Real BoxGeometry with thickness) */}
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onPointerOver?.();
        }}
        onPointerOut={() => onPointerOut?.()}
      >
        <boxGeometry args={[1.38, 2.05, 0.026]} />
        <meshStandardMaterial
          color="#26221E"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* Front Face: High-Resolution HTML Overlay */}
      <Html
        transform
        position={[0, 0, 0.016]}
        distanceFactor={2.7}
        className="select-none pointer-events-auto"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className={`w-[188px] h-[278px] rounded-[18px] bg-[#241F1A] border-2 p-3.5 flex flex-col justify-between items-center text-center shadow-2xl transition-all cursor-pointer ${
            isHovered
              ? 'border-candle-amber shadow-[0_0_25px_rgba(224,169,109,0.35)] scale-[1.02]'
              : 'border-[#4A3E34]'
          }`}
          style={{
            borderColor: isHovered ? '#E0A96D' : `${level.accentColor || '#E0A96D'}50`,
          }}
        >
          {/* Top Row with Level Badge and Icon */}
          <div className="w-full flex items-center justify-between">
            <span
              className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 border"
              style={{
                color: level.accentColor || '#E0A96D',
                borderColor: `${level.accentColor || '#E0A96D'}40`,
              }}
            >
              {level.badge || `Уровень ${level.id}`}
            </span>
            {getLevelIcon()}
          </div>

          {/* Center Title and Description */}
          <div className="my-auto flex flex-col items-center">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center border bg-black/35 mb-2 shadow-inner"
              style={{ borderColor: `${level.accentColor || '#E0A96D'}40` }}
            >
              {getLevelIcon()}
            </div>
            <h3 className="text-sm font-serif font-bold text-candle-cream leading-tight mb-1">
              {level.name || level.title}
            </h3>
            <p className="text-[9px] text-candle-muted line-clamp-2 px-1 leading-snug">
              {level.description || 'Нажмите, чтобы начать'}
            </p>
          </div>

          {/* Bottom Card Count */}
          <div className="w-full flex items-center justify-between pt-1.5 border-t border-candle-border/60 text-[9px]">
            <span className="text-candle-muted font-mono">
              {level.cardsCount || 35} карт
            </span>
            <span
              className="font-medium underline decoration-candle-amber/50"
              style={{ color: level.accentColor || '#E0A96D' }}
            >
              Выбрать
            </span>
          </div>
        </div>
      </Html>

      {/* Back Face: Solid Dark Velvet Backing with subtle gold border */}
      <mesh position={[0, 0, -0.015]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.36, 2.03]} />
        <meshStandardMaterial
          color="#1C1814"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

