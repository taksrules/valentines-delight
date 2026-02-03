/**
 * Occasion-based themes for journey viewer
 * Each occasion has its own colors, emojis, and default messages
 */

export interface OccasionTheme {
  colors: {
    primary: string;
    gradient: string;
    darkGradient: string;
  };
  emojis: string[];
  bigQuestionDefault: string;
  welcomeMessageDefault: string;
  celebrationMessage: string;
  retryMessage: string;
}

export const occasionThemes: Record<string, OccasionTheme> = {
  valentine: {
    colors: {
      primary: 'rose',
      gradient: 'from-rose-50 via-pink-50 to-red-50',
      darkGradient: 'dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900',
    },
    emojis: ['💕', '❤️', '💖', '✨'],
    bigQuestionDefault: 'Will you be my Valentine?',
    welcomeMessageDefault: "Hey {recipientName},\n\nBefore I ask you something important, let's take a moment to remember our journey together.\n\nAre you ready? 💕",
    celebrationMessage: "You said yes! 💕\n\nYou've made this Valentine's Day perfect.\n\nI can't wait to create more beautiful memories with you.",
    retryMessage: "You said yes! 💕\n\n(I knew you'd come around 😊)\n\nThank you for taking this journey with me.\n\nYou're worth every moment.",
  },
  
  proposal: {
    colors: {
      primary: 'amber',
      gradient: 'from-amber-50 via-yellow-50 to-orange-50',
      darkGradient: 'dark:from-neutral-950 dark:via-amber-950 dark:to-neutral-900',
    },
    emojis: ['💍', '✨', '🥂', '💫'],
    bigQuestionDefault: 'Will you marry me?',
    welcomeMessageDefault: "Hey {recipientName},\n\nI have something very special to ask you.\n\nBut first, let's remember our journey together.\n\nAre you ready? 💍",
    celebrationMessage: "YES! 💍\n\nYou've just made me the happiest person alive!\n\nI can't wait to spend forever with you.",
    retryMessage: "YES! 💍\n\n(I knew you'd say yes eventually 😊)\n\nThank you for making me wait... it was worth it.\n\nLet's start our forever together.",
  },
  
  anniversary: {
    colors: {
      primary: 'purple',
      gradient: 'from-purple-50 via-pink-50 to-fuchsia-50',
      darkGradient: 'dark:from-neutral-950 dark:via-purple-950 dark:to-neutral-900',
    },
    emojis: ['🎉', '💐', '🥰', '🎊'],
    bigQuestionDefault: 'To many more years together?',
    welcomeMessageDefault: "Hey {recipientName},\n\nHappy Anniversary!\n\nLet's celebrate our journey together and all the beautiful moments we've shared.\n\nAre you ready? 🎉",
    celebrationMessage: "Cheers to us! 🎉\n\nHere's to another amazing year together.\n\nI love you more with each passing day.",
    retryMessage: "Cheers to us! 🎉\n\n(I knew you couldn't resist 😊)\n\nThank you for every moment we've shared.\n\nHere's to many more years together.",
  },
  
  apology: {
    colors: {
      primary: 'blue',
      gradient: 'from-blue-50 via-cyan-50 to-teal-50',
      darkGradient: 'dark:from-neutral-950 dark:via-blue-950 dark:to-neutral-900',
    },
    emojis: ['🌸', '💙', '🕊️', '🌺'],
    bigQuestionDefault: 'Can you forgive me?',
    welcomeMessageDefault: "Hey {recipientName},\n\nI know I've hurt you, and I'm truly sorry.\n\nLet me show you how much you mean to me.\n\nWill you hear me out? 💙",
    celebrationMessage: "Thank you 💙\n\nYour forgiveness means everything to me.\n\nI promise to do better and cherish what we have.",
    retryMessage: "Thank you 💙\n\n(I know I didn't deserve it, but thank you)\n\nI'll spend every day proving I'm worthy of your forgiveness.",
  },
  
  long_distance: {
    colors: {
      primary: 'indigo',
      gradient: 'from-indigo-50 via-purple-50 to-pink-50',
      darkGradient: 'dark:from-neutral-950 dark:via-indigo-950 dark:to-neutral-900',
    },
    emojis: ['🌍', '💌', '✈️', '💕'],
    bigQuestionDefault: 'Will you wait for me?',
    welcomeMessageDefault: "Hey {recipientName},\n\nEven though we're miles apart, you're always in my heart.\n\nLet's remember why distance can't keep us apart.\n\nAre you ready? 💌",
    celebrationMessage: "You said yes! 💌\n\nDistance means nothing when you mean everything.\n\nI can't wait until we're together again.",
    retryMessage: "You said yes! 💌\n\n(I knew our love was stronger than distance 😊)\n\nThank you for waiting for me.\n\nWe'll be together soon.",
  },
  
  custom: {
    colors: {
      primary: 'neutral',
      gradient: 'from-neutral-50 via-gray-50 to-slate-50',
      darkGradient: 'dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900',
    },
    emojis: ['💝', '✨', '💫', '🌟'],
    bigQuestionDefault: 'What do you say?',
    welcomeMessageDefault: "Hey {recipientName},\n\nI created something special for you.\n\nLet's take this journey together.\n\nAre you ready? ✨",
    celebrationMessage: "You said yes! ✨\n\nThank you for being part of this moment.\n\nIt means the world to me.",
    retryMessage: "You said yes! ✨\n\n(I'm so glad you came around 😊)\n\nThank you for taking this journey with me.",
  },
};

/**
 * Get theme for an occasion type
 */
export function getOccasionTheme(occasionType: string): OccasionTheme {
  return occasionThemes[occasionType] || occasionThemes.custom;
}

/**
 * Format message with placeholders
 */
export function formatMessage(message: string, replacements: Record<string, string>): string {
  let formatted = message;
  Object.entries(replacements).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return formatted;
}

/**
 * Get gradient classes for occasion
 */
export function getGradientClasses(occasionType: string): string {
  const theme = getOccasionTheme(occasionType);
  return `bg-gradient-to-br ${theme.colors.gradient} ${theme.colors.darkGradient}`;
}

/**
 * Get primary color for occasion
 */
export function getPrimaryColor(occasionType: string): string {
  const theme = getOccasionTheme(occasionType);
  return theme.colors.primary;
}
