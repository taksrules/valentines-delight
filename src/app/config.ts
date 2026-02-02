import { ValentineConfig } from './types';

export const valentineConfig: ValentineConfig = {
  recipientName: 'Dione 💕',
  senderName: 'Your Cheif',
  tone: 'romantic',
  enableMusic: true, // Set to false to disable background music
  jamendoClientId: process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID || '', // Set in .env.local
  
  memoryQuestions: [
    {
      id: 'q1',
      prompt: 'Let\'s start with something simple...',
      question: 'What\'s your favorite thing about us?',
      answers: [
        'The way we laugh together',
        'Our quiet moments',
        'How we understand each other',
        'Everything'
      ],
      acknowledgment: 'That makes my heart smile 💕'
    },
    {
      id: 'q2',
      prompt: 'Think back to our beginning...',
      question: 'What moment made you realize we were special?',
      answers: [
        'The first time we talked for hours',
        'When you made me laugh unexpectedly',
        'A quiet moment that felt perfect',
        'I just knew from the start'
      ],
      acknowledgment: 'I remember that feeling too ✨'
    },
    {
      id: 'q3',
      prompt: 'Every journey has its treasures...',
      question: 'What memory of ours do you hold closest?',
      answers: [
        'A spontaneous adventure',
        'A cozy evening together',
        'A meaningful conversation',
        'Too many to choose just one'
      ],
      acknowledgment: 'Those moments are precious to me 🌟'
    },
    {
      id: 'q4',
      prompt: 'Looking at where we are now...',
      question: 'What do you love most about our journey?',
      answers: [
        'How we\'ve grown together',
        'The comfort we\'ve found',
        'The adventures we\'ve shared',
        'Simply being together'
      ],
      acknowledgment: 'And there\'s so much more ahead of us 💫'
    }
  ],
  
  memoryPhotos: [
    {
      id: 'photo1',
      url: '/images/memory-1.jpg',
      caption: 'Where it all started ❤️'
    },
    {
      id: 'photo2',
      url: '/images/memory-2.jpeg',
      caption: 'My favorite smile 😊'
    },
    {
      id: 'photo3',
      url: '/images/memory-3.jpg',
      caption: 'This perfect day ✨'
    },
    {
      id: 'photo4',
      url: '/images/memory-4.jpeg',
      caption: 'Us 💕'
    }
  ],
  
  customMessages: {
    welcome: `Hey ${'{recipientName}'},\n\nBefore I ask you something important, let's take a moment to remember our journey together.\n\nAre you ready? 💕`,
    
    transition: 'After everything we\'ve shared...\n\nThere\'s one more thing I want to ask you...',
    
    bigQuestion: 'Will you be my Valentine?',
    
    firstYes: `You said yes! 💕\n\nYou've made this Valentine's Day perfect.\n\nI can't wait to create more beautiful memories with you.`,
    
    retryYes: `You said yes! 💕\n\n(I knew you'd come around 😊)\n\nThank you for taking this journey with me... ${'{retryCount}'} time(s).\n\nYou're worth every moment.`,
    
    noResponse: 'That\'s okay... let\'s remember our journey again 💭'
  }
};

// Helper function to replace placeholders in messages
export function formatMessage(message: string, replacements: Record<string, string>): string {
  let formatted = message;
  Object.entries(replacements).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return formatted;
}
