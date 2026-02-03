'use client';

import { AnimatePresence } from 'framer-motion';
import { useJourneyState } from '@/hooks/useJourneyState';
import { valentineConfig } from '@/app/config';
import WelcomeScreen from '@/components/WelcomeScreen';
import MemoryQuestion from '@/components/MemoryQuestion';
import MemoryReveal from '@/components/MemoryReveal';
import TransitionScreen from '@/components/TransitionScreen';
import BigQuestion from '@/components/BigQuestion';
import CelebrationScreen from '@/components/CelebrationScreen';
import BackgroundMusic from '@/components/BackgroundMusic';

export default function Home() {
  const { state, goToScreen, nextQuestion, saveAnswer, handleNo, handleYes, reset } = useJourneyState();
  
  const handleStartJourney = () => {
    goToScreen('memory-question');
  };
  
  const handleAnswerQuestion = (answer: string) => {
    const currentQuestion = valentineConfig.memoryQuestions[state.currentQuestionIndex];
    saveAnswer(currentQuestion.id, answer);
    
    // Check if there are more questions
    if (state.currentQuestionIndex < valentineConfig.memoryQuestions.length - 1) {
      nextQuestion();
    } else {
      // All questions answered, move to memory reveal
      goToScreen('memory-reveal');
    }
  };
  
  const handleMemoryRevealComplete = () => {
    goToScreen('transition');
  };
  
  const handleTransitionComplete = () => {
    goToScreen('big-question');
  };
  
  const handleNoClick = () => {
    handleNo();
  };
  
  const handleYesClick = () => {
    handleYes();
  };
  
  const handleReplay = () => {
    reset();
  };
  
  return (
    <main className="relative min-h-screen">
      {valentineConfig.enableMusic && (
        <BackgroundMusic clientId={valentineConfig.jamendoClientId} />
      )}
      
      <AnimatePresence mode="wait">
        {state.currentScreen === 'welcome' && (
          <WelcomeScreen 
            key="welcome"
            onStart={handleStartJourney}
            retryCount={state.retryCount}
          />
        )}
        
        {state.currentScreen === 'memory-question' && (
          <MemoryQuestion
            key={`question-${state.currentQuestionIndex}`}
            question={valentineConfig.memoryQuestions[state.currentQuestionIndex]}
            questionIndex={state.currentQuestionIndex}
            totalQuestions={valentineConfig.memoryQuestions.length}
            onAnswer={handleAnswerQuestion}
          />
        )}
        
        {state.currentScreen === 'memory-reveal' && (
          <MemoryReveal
            key="memory-reveal"
            photos={valentineConfig.memoryPhotos}
            onComplete={handleMemoryRevealComplete}
          />
        )}
        
        {state.currentScreen === 'transition' && (
          <TransitionScreen
            key="transition"
            onComplete={handleTransitionComplete}
          />
        )}
        
        {state.currentScreen === 'big-question' && (
          <BigQuestion
            key="big-question"
            onYes={handleYesClick}
            onNo={handleNoClick}
            retryCount={state.retryCount}
          />
        )}
        
        {state.currentScreen === 'celebration' && (
          <CelebrationScreen
            key="celebration"
            retryCount={state.retryCount}
            onReplay={handleReplay}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

