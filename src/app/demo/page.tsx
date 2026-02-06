'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuestionSlide from '@/components/journey/QuestionSlide';
import MemoryReveal from '@/components/MemoryReveal';
import BigQuestion from '@/components/BigQuestion';
import CelebrationScreen from '@/components/CelebrationScreen';
import TransitionScreen from '@/components/TransitionScreen';
import BackgroundMusic from '@/components/BackgroundMusic';

// Demo Data
const DEMO_DATA = {
  creatorName: "Alex",
  recipientName: "Sarah",
  occasionType: "valentine",
  musicEnabled: true,
  questions: [
    {
      id: "q1",
      questionText: "What first made you smile about us?",
      option1: "The way you laugh",
      option2: "How easy it felt to talk",
      option3: "That look in your eyes",
      option4: "Everything about you",
      acknowledgmentText: "I remember noticing the way you looked at me that day. I felt it too.",
      questionOrder: 1
    },
    {
      id: "q2",
      questionText: "When do you feel most yourself with me?",
      option1: "When we're just talking",
      option2: "On our adventures",
      option3: "In quiet moments",
      option4: "All the time",
      acknowledgmentText: "I love that we can just be ourselves together.",
      questionOrder: 2
    },
    {
      id: "q3",
      questionText: "What's one memory you'd want to relive?",
      option1: "Our first date",
      option2: "That trip we took",
      option3: "A random perfect day",
      option4: "Too many to choose",
      acknowledgmentText: "I'd relive that moment with you in a heartbeat.",
      questionOrder: 3
    },
    {
      id: "q4",
      questionText: "What are you most excited about with us?",
      option1: "Adventures ahead",
      option2: "Building something real",
      option3: "Just more time with you",
      option4: "Everything",
      acknowledgmentText: "Me too. I can't wait to see where we go from here.",
      questionOrder: 4
    }
  ],
  photos: [
    { 
      id: "p1", 
      url: "/demo/photo-1.png", 
      caption: "That first coffee date downtown" 
    },
    { 
      id: "p2", 
      url: "/demo/photo-2.png", 
      caption: "Weekend getaway last summer" 
    },
    { 
      id: "p3", 
      url: "/demo/photo-3.png", 
      caption: "Just us being ourselves" 
    },
    { 
      id: "p4", 
      url: "/demo/photo-4.png", 
      caption: "Every moment counts" 
    }
  ],
  bigQuestion: "Will you be my Valentine?"
};

type SlideType = 'welcome' | 'question' | 'transition' | 'photos' | 'bigQuestion' | 'celebration';

interface Slide {
  type: SlideType;
  index?: number;
}

export default function DemoPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [noClickCount, setNoClickCount] = useState(0);

  const slides: Slide[] = [
    { type: 'welcome' },
    ...DEMO_DATA.questions.map((_, i) => ({ type: 'question' as SlideType, index: i })),
    { type: 'transition' },
    { type: 'photos' },
    { type: 'bigQuestion' },
    { type: 'celebration' },
  ];

  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setResponses({ ...responses, [questionId]: answer });
    setTimeout(handleNext, 2500);
  };

  const handleNoClick = () => {
    setNoClickCount(noClickCount + 1);
    const photosIndex = slides.findIndex(s => s.type === 'photos');
    if (photosIndex !== -1) {
      setCurrentSlideIndex(photosIndex);
    }
  };

  return (
    <main className="relative min-h-screen bg-cream-50 overflow-hidden">
      {/* Demo Badge */}
      <div className="fixed top-6 left-6 z-50 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full text-white shadow-2xl border border-white/10"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wider uppercase">Demo Experience</span>
        </motion.div>
      </div>

      {DEMO_DATA.musicEnabled && (
        <BackgroundMusic
          autoPlay={true}
          mood="romantic"
        />
      )}

      <AnimatePresence mode="wait">
        {currentSlide.type === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            recipientName={DEMO_DATA.recipientName}
            creatorName={DEMO_DATA.creatorName}
            occasionType={DEMO_DATA.occasionType}
            onStart={handleNext}
            retryCount={noClickCount}
          />
        )}

        {currentSlide.type === 'question' && currentSlide.index !== undefined && (
          <QuestionSlide
            key={`question-${currentSlide.index}`}
            question={DEMO_DATA.questions[currentSlide.index]}
            questionNumber={currentSlide.index + 1}
            totalQuestions={DEMO_DATA.questions.length}
            occasionType={DEMO_DATA.occasionType}
            selectedAnswer={responses[DEMO_DATA.questions[currentSlide.index].id]}
            onAnswer={(answer: string) => handleAnswer(DEMO_DATA.questions[currentSlide.index!].id, answer)}
            // Simplified for demo
            onPrevious={() => setCurrentSlideIndex(currentSlideIndex - 1)}
          />
        )}

        {currentSlide.type === 'transition' && (
          <TransitionScreen
            key="transition"
            onComplete={handleNext}
          />
        )}

        {currentSlide.type === 'photos' && (
          <MemoryReveal
            key="photos"
            photos={DEMO_DATA.photos}
            occasionType={DEMO_DATA.occasionType}
            onComplete={handleNext}
          />
        )}

        {currentSlide.type === 'bigQuestion' && (
          <BigQuestion
            key="bigQuestion"
            questionText={DEMO_DATA.bigQuestion}
            occasionType={DEMO_DATA.occasionType}
            onYes={handleNext}
            onNo={handleNoClick}
            retryCount={noClickCount}
          />
        )}

        {currentSlide.type === 'celebration' && (
          <CelebrationScreen
            key="celebration"
            recipientName={DEMO_DATA.recipientName}
            creatorName={DEMO_DATA.creatorName}
            occasionType={DEMO_DATA.occasionType}
            photos={DEMO_DATA.photos}
            retryCount={noClickCount}
            isDemo={true}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
