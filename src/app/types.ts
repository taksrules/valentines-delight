export type JourneyScreen = 
  | 'welcome'
  | 'memory-question'
  | 'memory-reveal'
  | 'transition'
  | 'big-question'
  | 'celebration';

export interface MemoryQuestion {
  id: string;
  prompt: string;
  question: string;
  answers: string[];
  acknowledgment: string;
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface JourneyState {
  currentScreen: JourneyScreen;
  currentQuestionIndex: number;
  retryCount: number;
  userAnswers: Record<string, string>;
  hasCompletedOnce: boolean;
}

export interface ValentineConfig {
  recipientName: string;
  senderName: string;
  tone: 'romantic' | 'playful' | 'mixed';
  enableMusic: boolean;
  jamendoClientId: string;
  memoryQuestions: MemoryQuestion[];
  memoryPhotos: MemoryPhoto[];
  customMessages: {
    welcome: string;
    transition: string;
    bigQuestion: string;
    firstYes: string;
    retryYes: string;
    noResponse: string;
  };
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
}
