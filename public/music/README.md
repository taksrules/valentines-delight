# 🎵 Jamendo Music API Setup

The Valentine Journey uses the **Jamendo Music API** to automatically fetch romantic background music!

## Quick Setup (3 Steps)

### 1. Get Your Free API Key

1. Visit [Jamendo Developer Portal](https://devportal.jamendo.com/)
2. Create a free account
3. Create a new application
4. Copy your **Client ID**

### 2. Add to Environment Variables

Create a `.env.local` file in the project root (or copy from `.env.example`):

```bash
# .env.local
NEXT_PUBLIC_JAMENDO_CLIENT_ID=your_actual_client_id_here
```

**Important**: 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix is required for Next.js client-side access
- Restart the dev server after adding the environment variable

### 3. Done! 🎉

The app will automatically:
- Fetch romantic piano and love-themed tracks
- Pick a random track from the top results
- Loop the music at 30% volume
- Show track info while playing
- Allow users to skip to a different track

## Features

✅ **Automatic Music Loading** - No manual file uploads needed
✅ **Mood-Based Filtering** - Uses "romantic", "piano", and "love" tags
✅ **Random Selection** - Picks from top 5 tracks for variety
✅ **Skip Functionality** - Users can skip to a different romantic track
✅ **Track Attribution** - Shows artist name and track title
✅ **Error Handling** - Graceful fallback if API fails
✅ **Free for Personal Use** - Creative Commons licensed

## How It Works

The component uses Jamendo's fuzzy tag search:

```
https://api.jamendo.com/v3.0/tracks/
  ?client_id=YOUR_ID
  &fuzzytags=romantic+piano+love
  &limit=5
  &audioformat=mp32
```

This returns high-quality romantic tracks that are:
- Tagged with romantic/love themes
- Often featuring piano
- Professional audio quality
- Creative Commons licensed

## Customizing Music Selection

Want different vibes? Edit the fuzzy tags in [`BackgroundMusic.tsx`](file:///d:/Admin/Documents/Github/valentines-delight/src/components/BackgroundMusic.tsx):

```typescript
// Current: romantic piano love
const searchUrl = `...&fuzzytags=romantic+piano+love...`;

// Try these alternatives:
// Acoustic romantic: fuzzytags=romantic+acoustic+guitar
// Classical love: fuzzytags=romantic+classical+strings
// Jazz romance: fuzzytags=romantic+jazz+smooth
// Ambient love: fuzzytags=romantic+ambient+chill
```

## Troubleshooting

### Music Not Playing?
1. Check that you've added your Client ID to `config.ts`
2. Open browser console (F12) to see any errors
3. Verify your Jamendo account is active

### Want Different Tracks?
- Click the skip button (⏭️) to load a new random track
- Modify the fuzzy tags for different moods

### API Limits
- Free tier: Generous limits for personal projects
- Requires attribution (automatically shown in track info)
- For commercial use, check Jamendo's licensing

## License & Attribution

Jamendo tracks are Creative Commons licensed. The app automatically displays:
- Track name
- Artist name

This satisfies the attribution requirement for personal use.

---

**No music files needed - just add your API key and enjoy! 🎵💕**
