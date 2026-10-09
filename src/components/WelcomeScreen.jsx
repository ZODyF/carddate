import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Flame, HelpCircle, Volume2, VolumeX, Layers } from 'lucide-react';
import { soundFx } from '../utils/sound';
import { AppLogo } from './AppLogo';
import { QUESTIONS_DATA } from '../data/questions';

export const WelcomeScreen = ({
  onStartGame,
  soundEnabled,
  onToggleSound,
  onOpenInfo,
  initialLevel = 1,
}) => {
  const [activeDeckIndex, setActiveDeckIndex] = useState(() => {
    if (initialLevel === 'all') return 3;
    return typeof initialLevel === 'number' ? initialLevel - 1 : 0;
  });

  const [isOpening, setIsOpening] = useState(false);

  const decks = [
    {
      id: 1,
      title: 'Легкий',
      tag: 'Уровень 1',
      cardsCount: 35,
      icon: Sparkles,
      accentColor: '#E0A96D',
      boxBg: '#2A221C',
      lidBg: '#362B23',
      borderTone: '#E0A96D',
      glowColor: 'rgba(224, 169, 109, 0.25)',
    },
    {
      id: 2,
      title: 'Средний',
      tag: 'Уровень 2',
      cardsCount: 35,
      icon: Heart,
      accentColor: '#E29578',
      boxBg: '#2C1F1B',
      lidBg: '#3A2823',
      borderTone: '#E29578',
      glowColor: 'rgba(226, 149, 120, 0.25)',
    },
    {
      id: 3,
      title: 'Сложный',
      tag: 'Уровень 3',
      cardsCount: 35,
      icon: Flame,
      accentColor: '#D48C46',
      boxBg: '#2E1C16',
      lidBg: '#3E251E',
      borderTone: '#D48C46',
      glowColor: 'rgba(212, 140, 70, 0.28)',
    },
    {
      id: 'all',
      title: 'Все уровни',
      tag: 'Полная колода',
      cardsCount: 105,
      icon: Layers,
      accentColor: '#E0A96D',
      boxBg: '#2B231D',
      lidBg: '#382D25',
      borderTone: '#E0A96D',
      glowColor: 'rgba(224, 169, 109, 0.32)',
    },
  ];

  const currentDeck = decks[activeDeckIndex];

  // Get the first question card for this deck so the exact same card emerges!
  const firstCard = QUESTIONS_DATA.find((q) =>
    currentDeck.id === 'all' ? true : q.level === currentDeck.id
  ) || QUESTIONS_DATA[0];

  const handleOpenDeck = () => {
    if (isOpening) return;
    setIsOpening(true);

    soundFx.playBoxOpen();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 45, 25]);
    }

    // After the card emerges to the top, crossfade seamlessly into the game
    setTimeout(() => {
      onStartGame(currentDeck.id);
    }, 850);
  };

  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-between items-center px-4 py-5 overflow-hidden ambient-glow select-none">
      {/* Ambient glow matching active deck */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
        style={{ background: currentDeck.glowColor }}
      />

      {/* Top Header: Logo + Audio + Info */}
      <header className="w-full max-w-sm flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <AppLogo className="w-8 h-8" />
          <h1 className="text-xl font-bold font-serif tracking-wide text-candle-cream">
            Date Cards
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-candle-card/80 hover:bg-candle-card text-candle-muted hover:text-candle-amber border border-candle-border active:scale-95 transition-all shadow-sm"
            aria-label="Звук"
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
          <button
            onClick={onOpenInfo}
            className="p-2 rounded-xl bg-candle-card/80 hover:bg-candle-card text-candle-muted hover:text-candle-amber border border-candle-border active:scale-95 transition-all shadow-sm"
            aria-label="О колоде"
            title="Правила и советы"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Deck Selector Tabs */}
      <div className="w-full max-w-sm grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#201C18]/90 border border-candle-border z-30 shrink-0 my-1">
        {decks.map((deck, idx) => {
          const isActive = idx === activeDeckIndex;
          const IconComponent = deck.icon;
          return (
            <button
              key={deck.id}
              disabled={isOpening}
              onClick={() => {
                if (!isOpening) {
                  setActiveDeckIndex(idx);
                  soundFx.playSwipe();
                }
              }}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-candle-card text-candle-cream shadow-card-warm border border-candle-amber/40 font-semibold'
                  : 'text-candle-muted hover:text-candle-cream hover:bg-candle-card/40'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" style={{ color: deck.accentColor }} />
              <span className="truncate">{deck.id === 'all' ? 'Все' : `Ур. ${deck.id}`}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Perspective Scene Container */}
      <div
        className="relative w-full max-w-sm flex-1 flex flex-col items-center justify-center z-20 my-auto"
        style={{ perspective: '1000px', perspectiveOrigin: 'center 45%' }}
      >
        {/* 3D Deck Box Assembly */}
        <motion.div
          animate={
            isOpening
              ? {
                  rotateX: -26, // Upper part tilts smoothly towards the player
                  y: -10,
                  scale: 1.04,
                }
              : {
                  rotateX: 0,
                  y: 0,
                  scale: 1,
                }
          }
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            transformOrigin: 'bottom center', // Anchored at bottom so upper part tilts forward
            transformStyle: 'preserve-3d',
          }}
          onClick={handleOpenDeck}
          className="relative cursor-pointer group flex flex-col items-center justify-center select-none"
        >
          {/* Table shadow reacting to tilt */}
          <div
            className="absolute -bottom-5 w-[220px] h-[26px] rounded-full blur-xl pointer-events-none transition-all duration-500"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              transform: isOpening ? 'scale(1.1) translateY(8px)' : 'scale(1)',
            }}
          />

          {/* 1. SOLID BOX BACK (Inside Cavity) */}
          <div
            className="absolute top-0 left-0 w-[252px] h-[360px] rounded-[24px] bg-[#14100E] border border-candle-border/70 pointer-events-none z-0"
          />

          {/* 2. THE FIRST CARD (PHYSICALLY INSIDE THE BOX, BEHIND THE FRONT WALL) */}
          <motion.div
            initial={{ y: 0, scale: 0.96 }}
            animate={
              isOpening
                ? {
                    y: -240, // Slides straight up out of the top of the box
                    z: 50,   // Glides forward toward the player
                    scale: 1.08,
                    rotateX: 18, // Straightens upright to face player
                  }
                : {
                    y: 0,
                    z: 0,
                    scale: 0.96,
                    rotateX: 0,
                  }
            }
            transition={{
              delay: 0.16,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              backgroundColor: '#26201B', // 100% SOLID OPAQUE CARDSTOCK
            }}
            className="absolute top-2 w-[242px] h-[345px] rounded-[22px] border-2 border-candle-amber shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-5 flex flex-col justify-between items-center text-center pointer-events-none overflow-hidden z-10"
          >
            {/* Top row */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-candle-amber border border-candle-amber/30">
                {firstCard.category || currentDeck.tag}
              </span>
              <span className="text-[10px] text-candle-muted">
                {firstCard.turn}
              </span>
            </div>

            {/* Question Text */}
            <div className="my-auto px-1">
              <p className="text-sm sm:text-base font-serif font-medium text-candle-cream leading-snug">
                {firstCard.question}
              </p>
            </div>

            {/* Bottom cue */}
            <div className="w-full flex items-center justify-between pt-2 border-t border-candle-border/50 text-[10px] text-candle-muted">
              <span>{currentDeck.tag}</span>
              <Sparkles className="w-3 h-3 text-candle-amber" />
            </div>
          </motion.div>

          {/* 3. SOLID MAIN DECK BOX FRONT WALL (COVERS THE CARD WHEN CLOSED!) */}
          <div
            style={{
              backgroundColor: currentDeck.boxBg, // 100% SOLID OPAQUE FRONT WALL
              borderColor: `${currentDeck.borderTone}80`,
            }}
            className="relative w-[252px] h-[360px] rounded-[24px] border-2 shadow-[0_16px_35px_rgba(0,0,0,0.85)] p-5 flex flex-col justify-between items-center text-center overflow-hidden z-20"
          >
            {/* Top Thumb Cutout Notch */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 rounded-b-full bg-[#15110E] border-b border-x border-candle-border pointer-events-none z-20" />

            {/* Inner Gold Foil Filigree Border */}
            <div
              className="absolute inset-2 rounded-[18px] border border-dashed pointer-events-none"
              style={{ borderColor: `${currentDeck.accentColor}40` }}
            />
            <div
              className="absolute inset-3.5 rounded-[14px] border pointer-events-none"
              style={{ borderColor: `${currentDeck.accentColor}25` }}
            />

            {/* Corner Playing Card Symbols */}
            <div className="absolute top-3.5 left-3.5 flex flex-col items-center opacity-75">
              <span className="text-[10px] font-mono font-bold leading-none" style={{ color: currentDeck.accentColor }}>
                {currentDeck.cardsCount}
              </span>
              <currentDeck.icon className="w-2.5 h-2.5 mt-0.5" style={{ color: currentDeck.accentColor }} />
            </div>
            <div className="absolute bottom-3.5 right-3.5 flex flex-col items-center rotate-180 opacity-75">
              <span className="text-[10px] font-mono font-bold leading-none" style={{ color: currentDeck.accentColor }}>
                {currentDeck.cardsCount}
              </span>
              <currentDeck.icon className="w-2.5 h-2.5 mt-0.5" style={{ color: currentDeck.accentColor }} />
            </div>

            {/* Top Deck Tag */}
            <div className="relative z-10 pt-1">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border bg-black/40"
                style={{
                  color: currentDeck.accentColor,
                  borderColor: `${currentDeck.accentColor}50`,
                }}
              >
                {currentDeck.tag}
              </span>
            </div>

            {/* Center Box Medallion with AppLogo & Title */}
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div
                className="relative w-18 h-18 rounded-full flex items-center justify-center shadow-inner mb-3 border bg-black/50 group-hover:scale-105 transition-transform p-3"
                style={{ borderColor: `${currentDeck.accentColor}60` }}
              >
                <AppLogo className="w-10 h-10" glow={true} />
              </div>
              <h2 className="text-xl font-serif font-bold text-candle-cream tracking-wide mb-1">
                {currentDeck.title}
              </h2>
              <div
                className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10"
                style={{ color: currentDeck.accentColor }}
              >
                {currentDeck.cardsCount} карт
              </div>
            </div>

            {/* Bottom Foil Filigree Seal */}
            <div className="relative z-10 w-full flex items-center justify-center gap-3 pt-2 pb-1 opacity-70">
              <div className="h-[1px] w-8" style={{ background: `linear-gradient(90deg, transparent, ${currentDeck.accentColor})` }} />
              <div className="flex items-center gap-1.5" style={{ color: currentDeck.accentColor }}>
                <span className="text-[9px]">✦</span>
                <span className="text-[9px]">✦</span>
                <span className="text-[9px]">✦</span>
              </div>
              <div className="h-[1px] w-8" style={{ background: `linear-gradient(90deg, ${currentDeck.accentColor}, transparent)` }} />
            </div>
          </div>

          {/* 4. 3D HINGED TOP FLAP (Swings open backward) */}
          <motion.div
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              backgroundColor: currentDeck.lidBg,
              borderColor: `${currentDeck.borderTone}80`,
            }}
            animate={
              isOpening
                ? {
                    rotateX: -135, // Flips open backward smoothly
                    y: -3,
                  }
                : {
                    rotateX: 0,
                    y: 0,
                  }
            }
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute top-0 left-0 w-[252px] h-[50px] rounded-t-[24px] rounded-b-[8px] border-t-2 border-x-2 shadow-lg z-30 pointer-events-none flex items-center justify-center"
          >
            {/* Flap gold fold line and seal */}
            <div className="w-10 h-1 rounded-full bg-candle-amber/40 mt-2.5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Clean Bottom Area without button */}
      <div className="w-full max-w-sm h-6 z-20 shrink-0" />
    </div>
  );
};
