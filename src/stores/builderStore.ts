import { create } from 'zustand';

export interface Question {
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4?: string;
  acknowledgmentText: string;
}

export interface Photo {
  id?: string;
  imageUrl: string; // Supabase Storage URL for database
  caption: string;
  file?: File;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType?: string;
  previewUrl?: string; // Local preview URL for immediate display
}

interface BuilderState {
  // Journey metadata
  journeyId: string | null;
  currentStep: number;
  isSaving: boolean;
  lastSaved: Date | null;

  // Step 1: Occasion
  occasionType: string;

  // Step 2: Names
  recipientName: string;
  creatorName: string;

  // Step 3: Questions
  questions: Question[];
  questionSource: 'template' | 'bank' | 'custom';

  // Step 4: Photos
  photos: Photo[];

  // Step 5: Settings
  musicEnabled: boolean;
  musicMood: string;
  uniqueSlug: string;
  referralCode: string;
  allowSharing: boolean;
  successPhoto: Photo | null;

  // Actions
  setJourneyId: (id: string) => void;
  setStep: (step: number) => void;
  setOccasionType: (type: string) => void;
  setRecipientName: (name: string) => void;
  setCreatorName: (name: string) => void;
  setQuestions: (questions: Question[]) => void;
  setQuestionSource: (source: 'template' | 'bank' | 'custom') => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (index: number, question: Question) => void;
  removeQuestion: (index: number) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (index: number, photo: Partial<Photo>) => void;
  removePhoto: (index: number) => void;
  reorderPhotos: (startIndex: number, endIndex: number) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setMusicMood: (mood: string) => void;
  setUniqueSlug: (slug: string) => void;
  setSuccessPhoto: (photo: Photo | null) => void;
  setAllowSharing: (allow: boolean) => void;
  
  // Save/Load
  saveProgress: (turnstileToken?: string) => Promise<void>;
  loadJourney: (id: string) => Promise<void>;
  publishJourney: () => Promise<{ success: boolean; slug?: string; error?: string }>;
  reset: () => void;
}

const initialState = {
  journeyId: null,
  currentStep: 1,
  isSaving: false,
  lastSaved: null,
  occasionType: 'valentine',
  recipientName: '',
  creatorName: '',
  questions: [],
  questionSource: 'template' as const,
  photos: [],
  musicEnabled: true,
  musicMood: 'romantic',
  uniqueSlug: '',
  referralCode: '',
  allowSharing: true,
  successPhoto: null,
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...initialState,

  setJourneyId: (id) => set({ journeyId: id }),
  setStep: (step) => set({ currentStep: step }),
  setOccasionType: (type) => set({ occasionType: type }),
  setRecipientName: (name) => set({ recipientName: name }),
  setCreatorName: (name) => set({ creatorName: name }),
  setQuestions: (questions) => set({ questions }),
  setQuestionSource: (source) => set({ questionSource: source }),
  
  addQuestion: (question) => {
    const { questions } = get();
    if (questions.length < 4) {
      set({ questions: [...questions, question] });
    }
  },

  updateQuestion: (index, question) => {
    const { questions } = get();
    const updated = [...questions];
    updated[index] = question;
    set({ questions: updated });
  },

  removeQuestion: (index) => {
    const { questions } = get();
    set({ questions: questions.filter((_, i) => i !== index) });
  },

  reorderQuestions: (startIndex, endIndex) => {
    const { questions } = get();
    const result = Array.from(questions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ questions: result });
  },

  setPhotos: (photos) => set({ photos }),

  addPhoto: (photo) => {
    const { photos } = get();
    if (photos.length < 6) {
      set({ photos: [...photos, photo] });
    }
  },

  updatePhoto: (index, photoUpdate) => {
    const { photos } = get();
    const updated = [...photos];
    updated[index] = { ...updated[index], ...photoUpdate };
    set({ photos: updated });
  },

  removePhoto: (index) => {
    const { photos } = get();
    set({ photos: photos.filter((_, i) => i !== index) });
  },

  reorderPhotos: (startIndex, endIndex) => {
    const { photos } = get();
    const result = Array.from(photos);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ photos: result });
  },

  setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
  setMusicMood: (mood) => set({ musicMood: mood }),
  setUniqueSlug: (slug) => set({ uniqueSlug: slug }),
  setSuccessPhoto: (photo) => set({ successPhoto: photo }),
  setAllowSharing: (allow) => set({ allowSharing: allow }),

  saveProgress: async (turnstileToken?: string) => {
    const state = get();
    set({ isSaving: true });

    try {
      const journeyData: any = {
        occasionType: state.occasionType,
        recipientName: state.recipientName,
        creatorName: state.creatorName,
        musicEnabled: state.musicEnabled,
        musicMood: state.musicMood,
        allowSharing: state.allowSharing,
        successPhotoUrl: state.successPhoto?.imageUrl,
      };

      if (turnstileToken && typeof turnstileToken === 'string') {
        journeyData.turnstileToken = turnstileToken;
      }

      let journeyId = state.journeyId;

      // Create or update journey
      if (!journeyId) {
        const response = await fetch('/api/v1/journeys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(journeyData),
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          console.error('Failed to create journey:', data);
          throw new Error(data.error?.message || 'Failed to create journey');
        }
        
        journeyId = data.data.id;
        set({ journeyId });
      } else {
        const response = await fetch(`/api/v1/journeys/${journeyId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(journeyData),
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          console.error('Failed to update journey:', data);
          throw new Error(data.error?.message || 'Failed to update journey');
        }
      }

      // Save questions if any
      if (state.questions.length > 0 && journeyId) {
        const response = await fetch(`/api/v1/journeys/${journeyId}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions: state.questions }),
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          console.error('Failed to save questions:', data);
          // Don't throw here, journey is saved
        }
      }

      // Save photos if any
      if (state.photos.length > 0 && journeyId) {
        // First, delete existing photos
        await fetch(`/api/v1/journeys/${journeyId}/photos`, {
          method: 'DELETE',
        });

        // Then add all photos
        for (let i = 0; i < state.photos.length; i++) {
          const photo = state.photos[i];
          await fetch(`/api/v1/journeys/${journeyId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageUrl: photo.imageUrl,
              caption: photo.caption,
              photoOrder: i + 1,
            }),
          });
        }
      }

      set({ lastSaved: new Date(), isSaving: false });
    } catch (error) {
      console.error('Failed to save:', error);
      set({ isSaving: false });
      throw error; // Re-throw so caller can handle
    }
  },

  loadJourney: async (id) => {
    try {
      const response = await fetch(`/api/v1/journeys/${id}`);
      const { data } = await response.json();

      set({
        journeyId: data.id,
        occasionType: data.occasionType,
        recipientName: data.recipientName,
        creatorName: data.creatorName || '',
        musicEnabled: data.musicEnabled,
        musicMood: data.musicMood || 'romantic',
        questions: data.questions || [],
        photos: data.photos || [],
        uniqueSlug: data.uniqueSlug || '',
        referralCode: data.referralCode || '',
        allowSharing: data.allowSharing ?? true,
        successPhoto: data.successPhotoUrl ? { imageUrl: data.successPhotoUrl, caption: 'Success Photo' } : null,
      });
    } catch (error) {
      console.error('Failed to load journey:', error);
    }
  },

  publishJourney: async () => {
    const state = get();
    
    if (!state.journeyId) {
      return { success: false, error: 'No journey to publish' };
    }

    try {
      const response = await fetch(`/api/v1/journeys/${state.journeyId}/publish`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        set({ uniqueSlug: data.slug });
        return { success: true, slug: data.slug };
      }

      return { success: false, error: data.error };
    } catch (error) {
      console.error('Failed to publish:', error);
      return { success: false, error: 'Failed to publish journey' };
    }
  },

  reset: () => set(initialState),
}));
