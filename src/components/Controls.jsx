import React from 'react';
import { ArrowLeft, ArrowRight, SkipForward, HeartHandshake, Check } from 'lucide-react';

export const Controls = ({
  canGoBack,
  onPrevious,
  onSkip,
  onNext,
  onOpenDare,
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 pb-4 pt-1 z-20 shrink-0">
      <div className="flex items-center justify-between gap-3">
        {/* Previous Card Button */}
        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          aria-label="Предыдущая карта"
          title="Вернуться к предыдущей"
          className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all ${
            canGoBack
              ? 'bg-candle-card hover:bg-candle-cardLight text-candle-cream border-candle-border active:scale-95 shadow-sm'
              : 'bg-candle-card/30 text-candle-muted/30 border-candle-border/30 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Skip Button ("Пропустить") */}
        <button
          onClick={onSkip}
          aria-label="Пропустить вопрос"
          className="flex-1 py-3 px-3 rounded-2xl bg-candle-card hover:bg-candle-cardLight border border-candle-border text-candle-muted hover:text-candle-cream text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <SkipForward className="w-4 h-4 text-candle-muted" />
          <span>Пропустить</span>
        </button>

        {/* Next / Answered Button ("Следующий") */}
        <button
          onClick={onNext}
          aria-label="Следующий вопрос"
          className="flex-[1.4] py-3 px-4 rounded-2xl bg-gradient-to-r from-candle-amber to-candle-amberDark text-[#1A1715] font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-card-warm hover:brightness-105 active:scale-95 transition-all"
        >
          <span>Следующий</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
