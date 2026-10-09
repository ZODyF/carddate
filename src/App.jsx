import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS_DATA, LEVELS } from './data/questions';
import { Header } from './components/Header';
import { CardDeck } from './components/CardDeck';
import { Controls } from './components/Controls';
import { EndDeckScreen } from './components/EndDeckScreen';
import { DareModal } from './components/DareModal';
import { InfoModal } from './components/InfoModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { soundFx } from './utils/sound';

export default function App() {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [deck, setDeck] = useState(() => {
    return QUESTIONS_DATA.filter((q) => q.level === 1);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  
  // Date night turn state
  const turnCycle = ['Отвечают оба', 'Ход девушки', 'Ход парня'];
  const [turnIndex, setTurnIndex] = useState(0);

  // Modals & UI toggles
  const [isDareOpen, setIsDareOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synchronize sound state
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFx.enabled = nextState;
  };

  // Helper: Shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start game from the initial welcome deck
  const handleStartGame = (levelId) => {
    setSelectedLevel(levelId);
    let filtered =
      levelId === 'all'
        ? QUESTIONS_DATA
        : QUESTIONS_DATA.filter((q) => q.level === levelId);
    setDeck(filtered);
    setCurrentIndex(0);
    setHistory([]);
    setIsWelcomeOpen(false);
  };

  // Level change handler from header switcher
  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    let filtered =
      levelId === 'all'
        ? QUESTIONS_DATA
        : QUESTIONS_DATA.filter((q) => q.level === levelId);
    setDeck(filtered);
    setCurrentIndex(0);
    setHistory([]);
    soundFx.playChime();
  };

  // Shuffle current level
  const handleShuffle = () => {
    let filtered =
      selectedLevel === 'all'
        ? QUESTIONS_DATA
        : QUESTIONS_DATA.filter((q) => q.level === selectedLevel);
    setDeck(shuffleArray(filtered));
    setCurrentIndex(0);
    setHistory([]);
    soundFx.playChime();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  // Card advance handler
  const advanceCard = useCallback(
    (action = 'next') => {
      soundFx.playSwipe();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }

      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex((prev) => prev + 1);

      // Rotate turn assignment automatically
      setTurnIndex((prev) => (prev + 1) % turnCycle.length);
    },
    [currentIndex, turnCycle.length]
  );

  // Previous card handler
  const handlePrevious = () => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIndex);
    soundFx.playSwipe();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  // Reset current deck
  const handleReset = () => {
    setCurrentIndex(0);
    setHistory([]);
    soundFx.playChime();
  };

  // Toggle "Чей ход" manually on the card
  const handleToggleTurn = () => {
    setTurnIndex((prev) => (prev + 1) % turnCycle.length);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Complete dare replacement
  const handleCompleteDare = () => {
    soundFx.playDare();
    advanceCard('next');
  };

  const isDeckCompleted = currentIndex >= deck.length;

  return (
    <div className="relative w-full h-[100dvh] bg-candle-bg text-candle-cream select-none overflow-hidden ambient-glow">
      {/* Warm ambient candle aura background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full candle-aura pointer-events-none" />
      <div className="absolute bottom-10 right-4 w-48 h-48 rounded-full bg-candle-amberDark/10 blur-3xl pointer-events-none" />

      {/* Main Game Screen (always mounted, revealed smoothly when welcome fades) */}
      <div className="w-full h-full flex flex-col justify-between">
        {/* Header section with level selector & progress */}
        <Header
          currentLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
          progress={Math.min(currentIndex + 1, deck.length)}
          total={deck.length}
          onShuffle={handleShuffle}
          onOpenInfo={() => setIsInfoOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onBackToDeck={() => setIsWelcomeOpen(true)}
        />

        {/* Main card deck area or End of Deck screen */}
        <main className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden">
          {isDeckCompleted ? (
            <EndDeckScreen
              currentLevel={selectedLevel}
              cardsCount={deck.length}
              onReset={handleReset}
              onShuffleAndRestart={handleShuffle}
              onNextLevel={(lvl) => handleSelectLevel(lvl)}
              onBackToDeck={() => setIsWelcomeOpen(true)}
            />
          ) : (
            <CardDeck
              cards={deck}
              currentIndex={currentIndex}
              onSwipe={(dir) => advanceCard(dir)}
              onOpenDare={() => setIsDareOpen(true)}
              onToggleTurn={handleToggleTurn}
              currentTurnMode={turnCycle[turnIndex]}
            />
          )}
        </main>

        {/* Bottom controls bar (only if deck not finished) */}
        {!isDeckCompleted && (
          <Controls
            canGoBack={history.length > 0}
            onPrevious={handlePrevious}
            onSkip={() => advanceCard('skip')}
            onNext={() => advanceCard('next')}
            onOpenDare={() => setIsDareOpen(true)}
          />
        )}
      </div>

      {/* Welcome Screen as a smooth crossfading overlay */}
      <AnimatePresence>
        {isWelcomeOpen && (
          <motion.div
            key="welcome-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0 z-40 bg-candle-bg w-full h-full"
          >
            <WelcomeScreen
              onStartGame={handleStartGame}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onOpenInfo={() => setIsInfoOpen(true)}
              initialLevel={selectedLevel}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dare Modal ("Замена на действие") */}
      <DareModal
        isOpen={isDareOpen}
        onClose={() => setIsDareOpen(false)}
        onCompleteDare={handleCompleteDare}
      />

      {/* Info & Rules Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}
