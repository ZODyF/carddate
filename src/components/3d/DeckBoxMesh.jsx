import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AppLogo } from '../AppLogo';

export const DeckBoxMesh = ({
  isOpen,
  onClick,
  onPointerOver,
  onPointerOut,
  isHovered,
  activeColor = '#E0A96D',
}) => {
  const boxGroupRef = useRef();
  const lidPivotRef = useRef();

  useFrame((state, delta) => {
    const lerpSpeed = 6 * delta;

    // 1. Box tilt forward when opened (towards viewer)
    if (boxGroupRef.current) {
      const targetBoxRotX = isOpen ? 0.22 : 0; // ~12.6 degrees tilt forward
      const targetBoxPosY = isOpen ? -0.45 : 0;
      const targetBoxPosZ = isOpen ? 0.25 : 0;

      boxGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        boxGroupRef.current.rotation.x,
        targetBoxRotX,
        lerpSpeed
      );
      boxGroupRef.current.position.y = THREE.MathUtils.lerp(
        boxGroupRef.current.position.y,
        targetBoxPosY,
        lerpSpeed
      );
      boxGroupRef.current.position.z = THREE.MathUtils.lerp(
        boxGroupRef.current.position.z,
        targetBoxPosZ,
        lerpSpeed
      );
    }

    // 2. Lid hinge opening (~115° backward)
    if (lidPivotRef.current) {
      const targetLidRotX = isOpen ? -Math.PI * 0.65 : 0;
      lidPivotRef.current.rotation.x = THREE.MathUtils.lerp(
        lidPivotRef.current.rotation.x,
        targetLidRotX,
        lerpSpeed * 1.1
      );
    }
  });

  const boxWidth = 1.74;
  const boxHeight = 2.45;
  const boxDepth = 0.52;
  const wallThick = 0.055;

  return (
    <group
      ref={boxGroupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.();
      }}
      onPointerOut={() => onPointerOut?.()}
      cursor="pointer"
    >
      {/* ======================================================== */}
      {/* 3D HOLLOW BOX BODY (Dark Walnut & Gold Trim) */}
      {/* ======================================================== */}
      <group position={[0, -0.1, 0]}>
        {/* Front Wall with Thumb Notch cut */}
        <mesh position={[0, 0, (boxDepth - wallThick) / 2]} castShadow receiveShadow>
          <boxGeometry args={[boxWidth, boxHeight, wallThick]} />
          <meshStandardMaterial
            color="#26221E"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, 0, -(boxDepth - wallThick) / 2]} castShadow receiveShadow>
          <boxGeometry args={[boxWidth, boxHeight, wallThick]} />
          <meshStandardMaterial
            color="#221D19"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Left Side Wall */}
        <mesh position={[-(boxWidth - wallThick) / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThick, boxHeight, boxDepth]} />
          <meshStandardMaterial
            color="#241F1A"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Right Side Wall */}
        <mesh position={[(boxWidth - wallThick) / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThick, boxHeight, boxDepth]} />
          <meshStandardMaterial
            color="#241F1A"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Bottom Wall */}
        <mesh position={[0, -(boxHeight - wallThick) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[boxWidth, wallThick, boxDepth]} />
          <meshStandardMaterial
            color="#1F1A16"
            roughness={0.75}
            metalness={0.1}
          />
        </mesh>

        {/* Gold Trim Corner Edge Accents */}
        <mesh position={[-(boxWidth / 2), 0, boxDepth / 2]}>
          <boxGeometry args={[0.02, boxHeight, 0.02]} />
          <meshStandardMaterial color={activeColor} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[boxWidth / 2, 0, boxDepth / 2]}>
          <boxGeometry args={[0.02, boxHeight, 0.02]} />
          <meshStandardMaterial color={activeColor} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Front Face Design: High-Res HTML Plaque */}
        <Html
          transform
          position={[0, 0, boxDepth / 2 + 0.032]}
          distanceFactor={2.7}
          className="select-none pointer-events-auto"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className={`w-[218px] h-[308px] rounded-[24px] bg-gradient-to-b from-[#2E2620] via-[#241F1A] to-[#1C1713] border-2 p-4 flex flex-col justify-between items-center text-center shadow-xl transition-all cursor-pointer ${
              isHovered && !isOpen
                ? 'border-candle-amber shadow-[0_0_20px_rgba(224,169,109,0.3)] scale-[1.01]'
                : 'border-[#4A3E34]'
            }`}
            style={{ borderColor: `${activeColor}60` }}
          >
            {/* Top Cutout Thumb Arc */}
            <div className="w-12 h-4 rounded-b-full bg-[#181310] border-b border-x border-candle-border/60 -mt-4 mb-1" />

            {/* Top Badge */}
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-serif" style={{ color: activeColor }}>
              <span>✦</span>
              <span>Колода для свиданий</span>
              <span>✦</span>
            </div>

            {/* Center Medallion */}
            <div className="my-auto flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border bg-black/45 mb-2.5 shadow-inner"
                style={{ borderColor: `${activeColor}60` }}
              >
                <AppLogo className="w-10 h-10" glow={true} />
              </div>
              <h2 className="text-xl font-serif font-bold text-candle-cream tracking-wide mb-1">
                Date Cards
              </h2>
              <p className="text-[10px] text-candle-muted max-w-[150px] leading-tight">
                Коснитесь коробки, чтобы открыть
              </p>
            </div>

            {/* Bottom Filigree Seal */}
            <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-candle-border/40 text-[9px]" style={{ color: activeColor }}>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>
        </Html>
      </group>

      {/* ======================================================== */}
      {/* 3D HINGED TOP LID (Pivot at top-back edge) */}
      {/* ======================================================== */}
      <group
        ref={lidPivotRef}
        position={[0, boxHeight / 2 - 0.1, -boxDepth / 2]}
      >
        {/* Top Horizontal Plate */}
        <mesh position={[0, 0, boxDepth / 2]} castShadow receiveShadow>
          <boxGeometry args={[boxWidth + 0.04, wallThick, boxDepth + 0.04]} />
          <meshStandardMaterial
            color="#2A221D"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Front Hanging Flap/Lip of the Lid */}
        <mesh position={[0, -0.22, boxDepth]} castShadow receiveShadow>
          <boxGeometry args={[boxWidth + 0.04, 0.44, wallThick]} />
          <meshStandardMaterial
            color="#28201B"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* Gold Seal Bar on the Front Flap */}
        <mesh position={[0, -0.32, boxDepth + 0.015]}>
          <boxGeometry args={[0.5, 0.03, 0.015]} />
          <meshStandardMaterial color={activeColor} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
