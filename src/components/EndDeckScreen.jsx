import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Shuffle, Sparkles, Heart, ArrowRight, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEVELS } from '../data/questions';
import { AppLogo } from './AppLogo';

export const EndDeckScreen = ({
  currentLevel,
  cardsCount,
  onReset,
  onShuffleAndRestart,
  onNextLevel,
  onBackToDeck,
}) => {
  useEffect(() => {
    // Warm romantic amber and gold confetti burst
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E0A96D', '#D48C46', '#FAF3E0', '#E29578'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, []);

  const levelObj = LEVELS.find((l) => l.id === currentLevel);
  const nextLevel = typeof currentLevel === 'number' && currentLevel < 3 ? currentLevel + 1 : null;
  const nextLevelObj = nextLevel ? LEVELS.find((l) => l.id === nextLevel) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto"
    >
      {/* AppLogo Badge */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-candle-card border border-candle-amber/40 flex items-center justify-center shadow-candle-intense">
          <AppLogo className="w-12 h-12" glow={true} />
        </div>
      </div>

      <h2 className="text-2xl font-serif font-bold text-candle-cream mb-2">
        Колода завершена!
      </h2>

      <p className="text-sm text-candle-muted mb-6 leading-relaxed">
        {levelObj
          ? `Вы прошли все вопросы уровня «${levelObj.name}». Спасибо за откровенность, искренность и время, проведённое вместе.`
          : `Вы прошли все ${cardsCount} вопросов колоды. Надеемся, этот вечер стал для вас ещё теплее.`}
      </p>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        {nextLevelObj && (
          <button
            onClick={() => onNextLevel(nextLevel)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-candle-amber to-candle-amberDark text-[#1A1715] font-semibold text-sm flex items-center justify-center gap-2 shadow-card-warm hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <span>Перейти к «{nextLevelObj.name}»</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onShuffleAndRestart}
          className="w-full py-3 px-4 rounded-2xl bg-candle-card hover:bg-candle-cardLight text-candle-cream font-medium text-xs flex items-center justify-center gap-2 border border-candle-border active:scale-[0.98] transition-all"
        >
          <Shuffle className="w-4 h-4 text-candle-amber" />
          <span>Перемешать и начать сначала</span>
        </button>

        <button
          onClick={onReset}
          className="w-full py-2.5 px-4 rounded-2xl bg-transparent hover:bg-white/5 text-candle-muted hover:text-candle-cream font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить к началу</span>
        </button>

        <button
          onClick={onBackToDeck}
          className="w-full py-2 px-4 rounded-2xl bg-transparent hover:bg-white/5 text-candle-amber/90 hover:text-candle-amber font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Выбрать другую колоду</span>
        </button>
      </div>
    </motion.div>
  );
};
