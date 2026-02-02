# 💖 The Valentine Journey

An emotionally engaging, interactive Valentine's Day experience that guides your special someone through a memory-based journey before asking "Will you be my Valentine?"

![Valentine Journey](https://img.shields.io/badge/Made%20with-Love-ff69b4?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- 🎭 **Emotionally Paced Journey**: Slow, intentional transitions with romantic animations
- 💕 **Memory Questions**: 4 meaningful questions to reflect on your relationship
- 📸 **Photo Reveal**: Polaroid-style memory showcase with gentle animations
- 🎉 **Smart Retry Logic**: Playful handling of "No" responses with affectionate teasing
- 🎨 **Beautiful Design**: Romantic color palette, custom fonts, floating hearts
- 📱 **Mobile-First**: Fully responsive and touch-friendly
- ♿ **Accessible**: Keyboard navigation, reduced motion support, high contrast
- 🎯 **Customizable**: Easy personalization without coding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd valentines-delight

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Jamendo API client ID

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the magic! ✨

## 🎨 Customization

### 1. Set Up Music API (Required)

Get a free Jamendo API key:
1. Visit [Jamendo Developer Portal](https://devportal.jamendo.com/)
2. Create account and get your Client ID
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_JAMENDO_CLIENT_ID=your_client_id_here
```

### 2. Personalize Names & Messages

Edit `src/app/config.ts`:

```typescript
export const valentineConfig: ValentineConfig = {
  recipientName: 'Sarah',  // Your Valentine's name
  senderName: 'Alex',      // Your name
  tone: 'romantic',        // 'romantic', 'playful', or 'mixed'
  
  customMessages: {
    welcome: `Hey Sarah,\n\nBefore I ask you something important...`,
    bigQuestion: 'Will you be my Valentine?',
    // ... customize all messages
  }
}
```

### 3. Add Your Photos

1. Add 4 photos to `public/images/`:
   - `memory-1.jpg`
   - `memory-2.jpg`
   - `memory-3.jpg`
   - `memory-4.jpg`

2. Update captions in `src/app/config.ts`:

```typescript
memoryPhotos: [
  {
    id: 'photo1',
    url: '/images/memory-1.jpg',
    caption: 'Our first date ❤️'
  },
  // ... more photos
]
```

### 4. Customize Questions

Modify the `memoryQuestions` array in `src/app/config.ts` to ask your own meaningful questions.

## 🎯 Journey Flow

```
Welcome Screen
     ↓
Memory Questions (4)
     ↓
Memory Reveal (Photos)
     ↓
Transition
     ↓
Big Question (YES/NO)
     ↓
Celebration 🎉
```

**Special Feature**: If they click "No", the journey gently restarts with awareness of the retry. When they eventually say "Yes", the celebration acknowledges their journey with playful affection! 💕

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Effects**: Canvas Confetti
- **Fonts**: Dancing Script (romantic) + Inter (body)

## 📁 Project Structure

```
valentines-delight/
├── src/
│   ├── app/
│   │   ├── config.ts           # ⚙️ Customize here!
│   │   ├── types.ts
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── WelcomeScreen.tsx
│   │   ├── MemoryQuestion.tsx
│   │   ├── MemoryReveal.tsx
│   │   ├── TransitionScreen.tsx
│   │   ├── BigQuestion.tsx
│   │   ├── CelebrationScreen.tsx
│   │   └── ui/
│   └── hooks/
│       └── useJourneyState.ts
└── public/
    └── images/                 # 📸 Add your photos here!
```

## 🎨 Design Philosophy

This isn't just a website - it's a **moment, a memory, and a feeling**.

- **Emotional Pacing**: Every transition is slow and intentional
- **One Focus Per Screen**: Never overwhelm, always guide
- **Guidance Over Control**: The user feels safe, never pressured
- **Emotion Before Interaction**: Read first, act second

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
pnpm build
```

Then deploy to [Vercel](https://vercel.com) - it's optimized for Next.js!

### Other Platforms
- Netlify
- Any platform supporting Next.js

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast text
- Reduced motion support
- Focus indicators
- ARIA labels

## 📝 License

This project is open source and available for personal use. Feel free to customize it for your Valentine! 💕

## 💖 Credits

Built with love using the Valentine Journey specification - a thoughtfully designed romantic experience.

---

**Ready to ask the question?** 💍

1. Customize the config
2. Add your photos
3. Deploy
4. Share with your Valentine! 💕

*May your answer be "Yes!" (eventually 😊)*
