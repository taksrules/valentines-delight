'use client';

import { useState, useCallback } from 'react';
import { JourneyState, JourneyScreen } from '../app/types';

const initialState: JourneyState = {
  currentScreen: 'welcome',
  currentQuestionIndex: 0,
  retryCount: 0,
  userAnswers: {},
  hasCompletedOnce: false
};

export function useJourneyState() {
  const [state, setState] = useState<JourneyState>(initialState);
  
  const goToScreen = useCallback((screen: JourneyScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  }, []);
  
  const nextQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  }, []);
  
  const saveAnswer = useCallback((questionId: string, answer: string) => {
    setState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [questionId]: answer }
    }));
  }, []);
  
  const handleNo = useCallback(() => {
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      currentScreen: 'welcome',
      currentQuestionIndex: 0,
      hasCompletedOnce: true
    }));
  }, []);
  
  const handleYes = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentScreen: 'celebration'
    }));
  }, []);
  
  const reset = useCallback(() => {
    setState(initialState);
  }, []);
  
  return {
    state,
    goToScreen,
    nextQuestion,
    saveAnswer,
    handleNo,
    handleYes,
    reset
  };
}
