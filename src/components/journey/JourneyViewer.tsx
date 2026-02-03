'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import BigQuestion from '@/components/BigQuestion';
import MemoryReveal from '@/components/MemoryReveal';
import CelebrationScreen from '@/components/CelebrationScreen';
import BackgroundMusic from '@/components/BackgroundMusic';
import QuestionSlide from '@/components/journey/QuestionSlide';
import { getOccasionTheme, formatMessage } from '@/lib/occasion-themes';

interface Journey {
  id: string;
  recipientName: string;
  creatorName: string | null;
  occasionType: string;
  musicEnabled: boolean;
  musicAutoPlay: boolean;
  musicMood: string | null;
  includeBigQuestion: boolean;
  bigQuestionText: string | null;
  retryCount: number;
  questions: Array<{
    id: string;
    questionText: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string | null;
    acknowledgmentText: string;
    questionOrder: number;
  }>;
  photos: Array<{
    id: string;
    imageUrl: string;
    caption: string | null;
    photoOrder: number;
  }>;
}

interface JourneyViewerProps {
  journey: Journey;
  isPreview: boolean;
}

type SlideType = 'welcome' | 'question' | 'photos' | 'bigQuestion' | 'celebration';

interface Slide {
  type: SlideType;
  index?: number;
}

export default function JourneyViewer({ journey, isPreview }: JourneyViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [noClickCount, setNoClickCount] = useState(0);
  
  const theme = getOccasionTheme(journey.occasionType);

  // Build slide sequence
  const slides: Slide[] = [
    { type: 'welcome' },
    ...journey.questions.map((_, i) => ({ type: 'question' as SlideType, index: i })),
    { type: 'photos' },
    ...(journey.includeBigQuestion ? [{ type: 'bigQuestion' as SlideType }] : []),
    { type: 'celebration' },
  ];

  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setResponses({ ...responses, [questionId]: answer });
    setTimeout(handleNext, 2500); // Give time to read acknowledgment
  };

  const handleNoClick = () => {
    setNoClickCount(noClickCount + 1);
    // Loop back to photos
    const photosIndex = slides.findIndex(s => s.type === 'photos');
    if (photosIndex !== -1) {
      setCurrentSlideIndex(photosIndex);
    }
  };

  const handleYesClick = () => {
    handleNext();
  };

  const handleReplay = () => {
    setCurrentSlideIndex(0);
    setResponses({});
    setNoClickCount(0);
  };

  return (
    <>
      {/* Background Music */}
      {journey.musicEnabled && (
        <BackgroundMusic
          autoPlay={journey.musicAutoPlay}
          occasionType={journey.occasionType}
        />
      )}

      <AnimatePresence mode="wait">
        {currentSlide.type === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            recipientName={journey.recipientName}
            creatorName={journey.creatorName}
            occasionType={journey.occasionType}
            onStart={handleNext}
            retryCount={noClickCount}
          />
        )}

        {currentSlide.type === 'question' && currentSlide.index !== undefined && (
          <QuestionSlide
            key={`question-${currentSlide.index}`}
            question={journey.questions[currentSlide.index]}
            questionNumber={currentSlide.index + 1}
            totalQuestions={journey.questions.length}
            occasionType={journey.occasionType}
            selectedAnswer={responses[journey.questions[currentSlide.index].id]}
            onAnswer={(answer: string) => handleAnswer(journey.questions[currentSlide.index!].id, answer)}
            onPrevious={handlePrevious}
          />
        )}

        {currentSlide.type === 'photos' && (
          <MemoryReveal
            key="photos"
            photos={journey.photos.map(p => ({
              id: p.id,
              url: p.imageUrl,
              caption: p.caption || '',
            }))}
            occasionType={journey.occasionType}
            onComplete={handleNext}
          />
        )}

        {currentSlide.type === 'bigQuestion' && (
          <BigQuestion
            key="bigQuestion"
            questionText={journey.bigQuestionText || theme.bigQuestionDefault}
            occasionType={journey.occasionType}
            onYes={handleYesClick}
            onNo={handleNoClick}
            retryCount={noClickCount}
          />
        )}

        {currentSlide.type === 'celebration' && (
          <CelebrationScreen
            key="celebration"
            recipientName={journey.recipientName}
            creatorName={journey.creatorName}
            occasionType={journey.occasionType}
            photos={journey.photos.map(p => ({
              id: p.id,
              url: p.imageUrl,
              caption: p.caption || '',
            }))}
            retryCount={noClickCount}
            onReplay={isPreview ? handleReplay : undefined}
          />
        )}
      </AnimatePresence>
    </>
  );
}
