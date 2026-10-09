import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, Heart, Flame, RefreshCw, User, Users, HeartHandshake, Check, ChevronRight, HelpCircle } from 'lucide-react';
import { LEVELS, TURN_MODES } from '../data/questions';

export const CardDeck = ({
  cards,
  currentIndex,
  onSwipe,
  onOpenDare,
  onToggleTurn,
  currentTurnMode,
  isFavorite,
  onToggleFavorite,
}) => {
  const [exitDirection, setExitDirection] = useState(0);

  // Active card and background stack
  const activeCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];
  const nextNextCard = cards[currentIndex + 2];

  if (!activeCard) return null;

  return (
    <div className="relative w-full flex-1 flex items-center justify-center px-4 py-2 select-none touch-none">
      {/* Background card #2 (deepest) */}
      {nextNextCard && (
        <div
          className="absolute w-[88%] max-w-xs h-[400px] sm:h-[440px] rounded-[32px] bg-[#1E1A17] border border-candle-border/40 shadow-card-back pointer-events-none transition-all duration-300"
          style={{
            transform: 'translateY(24px) scale(0.90)',
            opacity: 0.45,
            zIndex: 1,
          }}
        />
      )}

      {/* Background card #1 (middle) */}
      {nextCard && (
        <div
          className="absolute w-[94%] max-w-xs h-[400px] sm:h-[440px] rounded-[32px] bg-[#221E1A] border border-candle-border/60 shadow-card-back pointer-events-none transition-all duration-300"
          style={{
            transform: 'translateY(12px) scale(0.95)',
            opacity: 0.75,
            zIndex: 2,
          }}
        />
      )}

      {/* Active Card */}
      <AnimatePresence custom={exitDirection} mode="wait">
        <ActiveCardItem
          key={activeCard.id || currentIndex}
          card={activeCard}
          totalRemaining={cards.length - currentIndex}
          currentIndex={currentIndex}
          onSwipe={onSwipe}
          setExitDirection={setExitDirection}
          onOpenDare={onOpenDare}
          onToggleTurn={onToggleTurn}
          currentTurnMode={currentTurnMode}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </AnimatePresence>
    </div>
  );
};

const ActiveCardItem = ({
  card,
  currentIndex,
  onSwipe,
  setExitDirection,
  onOpenDare,
  onToggleTurn,
  currentTurnMode,
  isFavorite,
  onToggleFavorite,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);
  const opacity = useTransform(x, [-260, -180, 0, 180, 260], [0.4, 0.9, 1, 0.9, 0.4]);

  // Swipe prompt cues
  const rightPromptOpacity = useTransform(x, [30, 100], [0, 1]);
  const leftPromptOpacity = useTransform(x, [-100, -30], [1, 0]);

  const levelInfo = LEVELS.find((l) => l.id === card.level) || LEVELS[0];

  const handleDragEnd = (event, info) => {
    const threshold = 95;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 450) {
      // Swiped Right -> Answered / Next
      setExitDirection(1);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      onSwipe('next');
    } else if (info.offset.x < -threshold || velocity < -450) {
      // Swiped Left -> Skip
      setExitDirection(-1);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      onSwipe('skip');
    }
  };

  const currentTurn = currentTurnMode || card.turn || 'Отвечают оба';

  const getTurnIcon = () => {
    if (currentTurn.includes('оба')) return <Users className="w-3.5 h-3.5 text-candle-amber" />;
    return <User className="w-3.5 h-3.5 text-candle-amber" />;
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity, zIndex: 10 }}
      initial={{ scale: 0.92, y: 15, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={(dir) => ({
        x: dir > 0 ? 380 : -380,
        opacity: 0,
        rotate: dir > 0 ? 22 : -22,
        transition: { duration: 0.28, ease: 'easeOut' },
      })}
      transition={{ type: 'spring', damping: 24, stiffness: 280 }}
      className="relative w-full max-w-xs h-[420px] sm:h-[450px] rounded-[32px] bg-gradient-to-b from-[#2B2621] via-[#24201C] to-[#1F1B18] border border-candle-border hover:border-candle-amber/40 shadow-card-warm flex flex-col justify-between p-6 cursor-grab active:cursor-grabbing overflow-hidden card-texture"
    >
      {/* Subtle warm backlight inside card */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-candle-amber/10 blur-2xl pointer-events-none" />

      {/* Swipe Badges Overlay (visual feedback during drag) */}
      <motion.div
        style={{ opacity: rightPromptOpacity }}
        className="absolute top-5 right-5 z-20 pointer-events-none px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-lg"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Отвечено</span>
      </motion.div>

      <motion.div
        style={{ opacity: leftPromptOpacity }}
        className="absolute top-5 left-5 z-20 pointer-events-none px-3 py-1 rounded-full bg-[#34241B]/90 border border-candle-amber/50 text-candle-amber text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-lg"
      >
        <span>Пропустить</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </motion.div>

      {/* Top Header of the Card */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Category Pill */}
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/25 text-candle-muted border border-white/5">
          {card.category || levelInfo.badge}
        </span>

        {/* Turn Selector Badge ("Чей ход") */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleTurn();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-candle-amber/10 border border-candle-amber/25 text-candle-cream hover:bg-candle-amber/20 active:scale-95 transition-all text-xs"
          title="Нажмите, чтобы сменить того, кто отвечает"
        >
          {getTurnIcon()}
          <span className="text-[11px] font-medium tracking-tight text-candle-amber">
            {currentTurn}
          </span>
          <RefreshCw className="w-2.5 h-2.5 text-candle-muted" />
        </button>
      </div>

      {/* Center Question Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center my-auto px-1 py-4">
        {/* Question Text */}
        <h2 className="text-[19px] sm:text-[21px] font-serif font-medium text-candle-cream leading-relaxed tracking-normal select-none">
          {card.question}
        </h2>

        {/* Hint text if present */}
        {card.hint && (
          <p className="mt-3.5 text-xs text-candle-muted/90 italic font-sans leading-snug max-w-[240px]">
            {card.hint}
          </p>
        )}
      </div>

      {/* Bottom of the Card: Dare / Action Replacement Button & Level icon */}
      <div className="relative z-10 pt-2 border-t border-candle-border/50 flex items-center justify-between">
        {/* "Замена / Действие" Romantic dare trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDare();
          }}
          className="group flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-candle-amber/10 hover:bg-candle-amber/20 border border-candle-amber/25 text-candle-amber active:scale-95 transition-all text-xs font-medium"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-candle-amber group-hover:scale-110 transition-transform" />
          <span>Замена на действие</span>
        </button>

        {/* Level badge icon */}
        <div className="flex items-center gap-1 text-[11px] text-candle-muted">
          {levelInfo.id === 1 && <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />}
          {levelInfo.id === 2 && <Heart className="w-3.5 h-3.5 text-[#E29578]" />}
          {levelInfo.id === 3 && <Flame className="w-3.5 h-3.5 text-[#D48C46]" />}
          <span className="text-[10px] tracking-wide">{levelInfo.badge}</span>
        </div>
      </div>
    </motion.div>
  );
};
