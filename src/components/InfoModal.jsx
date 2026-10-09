import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Sparkles, Heart, HelpCircle, ShieldCheck, Coffee } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm max-h-[85vh] rounded-3xl bg-candle-card border border-candle-border p-6 shadow-2xl text-candle-cream overflow-y-auto z-10 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-candle-border">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-candle-amber animate-candle-flicker" />
              <h2 className="text-base font-serif font-bold text-candle-cream">
                Как играть в Date Cards
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-candle-muted hover:text-candle-cream rounded-full hover:bg-white/5 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Atmosphere tip */}
          <div className="p-3.5 rounded-2xl bg-candle-amber/10 border border-candle-amber/20 flex gap-3 items-start">
            <Coffee className="w-5 h-5 text-candle-amber shrink-0 mt-0.5" />
            <div className="text-xs text-candle-cream/90 leading-relaxed">
              <strong className="text-candle-amber block mb-0.5">Идеальная атмосфера:</strong>
              Приглушите верхний свет, зажгите свечи, приготовьте любимый напиток и отложите рабочие чаты.
            </div>
          </div>

          {/* Section: Levels */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-candle-muted">
              3 Уровня близости
            </h3>
            
            <div className="p-2.5 rounded-xl bg-[#1F1B18] border border-candle-border flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#E0A96D] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-candle-cream">Уровень 1: Легкий</p>
                <p className="text-[11px] text-candle-muted">Уютные привычки, детство, еда и забавные истории для разминки.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#1F1B18] border border-candle-border flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-[#E29578] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-candle-cream">Уровень 2: Средний</p>
                <p className="text-[11px] text-candle-muted">Ценности, мечты, характер, отношение к миру и друг другу.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#1F1B18] border border-candle-border flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-[#D48C46] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-candle-cream">Уровень 3: Сложный</p>
                <p className="text-[11px] text-candle-muted">Искренние признания, романтика, влечение и нежные секреты.</p>
              </div>
            </div>
          </div>

          {/* Section: Mechanics */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-candle-muted">
              Правила комфорта
            </h3>
            <div className="text-xs text-candle-muted space-y-1.5 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-candle-amber font-bold">•</span>
                <span><strong>Свайп карты:</strong> Смахните влево или вправо, чтобы перейти к следующей карте.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-candle-amber font-bold">•</span>
                <span><strong>Кнопка «Замена / Действие»:</strong> Если вопрос слишком неловкий, нажмите кнопку и сделайте милое романтическое действие вместо ответа.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-candle-amber font-bold">•</span>
                <span><strong>Бейдж «Чей ход»:</strong> Нажмите на бейдж, чтобы переключить, кто сейчас отвечает.</span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-candle-border text-candle-cream hover:bg-candle-borderSubtle transition-all active:scale-[0.98]"
          >
            Всё понятно, играем
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
