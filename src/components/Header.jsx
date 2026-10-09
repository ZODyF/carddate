import React from 'react';
import { Flame, Sparkles, Heart, Shuffle, HelpCircle, Volume2, VolumeX, Layers } from 'lucide-react';
import { LEVELS } from '../data/questions';
import { AppLogo } from './AppLogo';

export const Header = ({
  currentLevel,
  onSelectLevel,
  progress,
  total,
  onShuffle,
  onOpenInfo,
  soundEnabled,
  onToggleSound,
  onBackToDeck,
}) => {
  const getLevelIcon = (id) => {
    switch (id) {
      case 1:
        return <Sparkles className="w-3.5 h-3.5" />;
      case 2:
        return <Heart className="w-3.5 h-3.5" />;
      case 3:
        return <Flame className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const progressPercent = total > 0 ? Math.min(100, Math.round((progress / total) * 100)) : 0;

  return (
    <header className="w-full max-w-md mx-auto pt-3 px-4 pb-2 flex flex-col gap-2.5 z-20 shrink-0">
      {/* Top row: Brand & Tool buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDeck}
          className="flex items-center gap-2.5 group text-left cursor-pointer active:scale-95 transition-transform"
          title="Главное меню колоды"
        >
          <AppLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <div>
            <h1 className="text-lg font-bold font-serif tracking-wide text-candle-cream leading-none group-hover:text-candle-amber transition-colors">
              Date Cards
            </h1>
          </div>
        </button>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBackToDeck}
            title="Главное меню / Выбор колоды"
            className="p-2 rounded-xl bg-candle-card/80 hover:bg-candle-card text-candle-muted hover:text-candle-amber border border-candle-border active:scale-95 transition-all shadow-sm"
            aria-label="Главное меню"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={onShuffle}
            title="Перемешать колоду"
            className="p-2 rounded-xl bg-candle-card/80 hover:bg-candle-card text-candle-muted hover:text-candle-amber border border-candle-border active:scale-95 transition-all shadow-sm"
            aria-label="Перемешать колоду"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            className="p-2 rounded-xl bg-candle-card/80 hover:bg-candle-card text-candle-muted hover:text-candle-amber border border-candle-border active:scale-95 transition-all shadow-sm"
            aria-label="Звук"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>

          <button
            onClick={onOpenInfo}
            title="Правила и советы"
            className="p-2 rounded-xl bg-candle-card/80 hover:bg-candle-card text-candle-muted hover:text-candle-amber border border-candle-border active:scale-95 transition-all shadow-sm"
            aria-label="Правила и советы"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level selector tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#201C18] border border-candle-border">
        {LEVELS.map((lvl) => {
          const isActive = currentLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => onSelectLevel(lvl.id)}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-candle-card text-candle-amber shadow-card-warm border border-candle-amber/30'
                  : 'text-candle-muted hover:text-candle-cream hover:bg-candle-card/40'
              }`}
            >
              {getLevelIcon(lvl.id)}
              <span className="truncate">{lvl.badge.replace('Уровень ', 'Ур. ')}</span>
            </button>
          );
        })}
        <button
          onClick={() => onSelectLevel('all')}
          className={`flex items-center justify-center py-1.5 px-1 rounded-xl text-xs font-medium transition-all ${
            currentLevel === 'all'
              ? 'bg-candle-card text-candle-amber shadow-card-warm border border-candle-amber/30'
              : 'text-candle-muted hover:text-candle-cream hover:bg-candle-card/40'
          }`}
        >
          <span>Все</span>
        </button>
      </div>

      {/* Progress bar with card counter */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between text-[11px] text-candle-muted">
          <span>
            {currentLevel === 'all'
              ? 'Все уровни'
              : LEVELS.find((l) => l.id === currentLevel)?.name || 'Колода'}
          </span>
          <span className="font-medium text-candle-cream">
            {total > 0 ? `${progress} из ${total}` : '0 / 0'}
          </span>
        </div>
        <div className="w-full h-1 bg-[#231F1B] rounded-full overflow-hidden border border-candle-border/50">
          <div
            className="h-full bg-gradient-to-r from-candle-amber to-candle-amberDark rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(224,169,109,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
