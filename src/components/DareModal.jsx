import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, X, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { DARES } from '../data/questions';

export const DareModal = ({ isOpen, onClose, onCompleteDare }) => {
  const [dareIndex, setDareIndex] = useState(() => Math.floor(Math.random() * DARES.length));

  if (!isOpen) return null;

  const currentDare = DARES[dareIndex];

  const handleNextDare = () => {
    let next;
    do {
      next = Math.floor(Math.random() * DARES.length);
    } while (next === dareIndex && DARES.length > 1);
    setDareIndex(next);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl bg-candle-card border border-candle-amber/30 p-6 shadow-candle-glow text-candle-cream overflow-hidden z-10"
        >
          {/* Ambient inner glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-candle-amber/15 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-candle-muted hover:text-candle-cream rounded-full hover:bg-white/5 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-candle-amber/15 text-candle-amber border border-candle-amber/30">
              <Sparkles className="w-3.5 h-3.5" />
              Романтическое действие
            </span>
          </div>

          <h3 className="text-lg font-serif font-bold text-candle-cream mb-2">
            Замена на действие
          </h3>
          <p className="text-xs text-candle-muted mb-6">
            Если вопрос пока кажется слишком личным или хочется добавить немного физической нежности и игры:
          </p>

          {/* Dare Card Box */}
          <motion.div
            key={dareIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-[#1C1815] border border-candle-border mb-6 text-center relative overflow-hidden shadow-inner"
          >
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-candle-amber/10 flex items-center justify-center border border-candle-amber/20 text-candle-amber">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <p className="text-base text-candle-cream font-medium leading-relaxed">
              «{currentDare}»
            </p>
          </motion.div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleNextDare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-candle-muted hover:text-candle-cream bg-[#2A241F] hover:bg-[#342D27] border border-candle-border active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Предложить другое действие
            </button>

            <button
              onClick={() => {
                onCompleteDare();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-candle-amber to-candle-amberDark text-[#1A1715] shadow-card-warm hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Действие выполнено (след. карта)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
