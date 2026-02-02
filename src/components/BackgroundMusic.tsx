'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundMusicProps {
  autoPlay?: boolean;
  clientId?: string; // Jamendo API client ID
}

interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  audiodownload: string;
}

export default function BackgroundMusic({ 
  autoPlay = false,
  clientId = 'YOUR_CLIENT_ID' // Replace with your Jamendo client ID
}: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(!autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<JamendoTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set to 30% volume for background ambiance
    }
  }, []);
  
  // Fetch romantic music from Jamendo API
  const loadRomanticMusic = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&fuzzytags=romantic+piano+love&limit=5&audioformat=mp32`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Pick a random track from the results for variety
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const track = data.results[randomIndex];
        setCurrentTrack(track);
        
        if (audioRef.current) {
          audioRef.current.src = track.audio;
          console.log(`🎵 Loaded: "${track.name}" by ${track.artist_name}`);
        }
      } else {
        setError('No romantic tracks found');
      }
    } catch (err) {
      console.error('Error fetching music:', err);
      setError('Failed to load music');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlay = async () => {
    // Load music if not already loaded
    if (!currentTrack && !error) {
      await loadRomanticMusic();
    }
    
    if (audioRef.current && currentTrack) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowPrompt(false);
      } catch (err) {
        console.error('Error playing audio:', err);
        setError('Failed to play music');
      }
    }
  };
  
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };
  
  const handleSkipTrack = async () => {
    handlePause();
    await loadRomanticMusic();
    if (audioRef.current && currentTrack) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        preload="none"
      />
      
      {/* Opt-in prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border-2 border-rose-200 flex items-center gap-4">
              <span className="text-sm text-neutral-700">
                🎵 Play romantic music?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePlay}
                  disabled={isLoading}
                  className="px-4 py-1 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="px-4 py-1 bg-neutral-200 text-neutral-600 rounded-full text-sm hover:bg-neutral-300 transition-colors"
                >
                  No thanks
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Music control button (always visible after prompt dismissed) */}
      {!showPrompt && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
          {/* Track info tooltip */}
          {currentTrack && isPlaying && (
            <motion.div
              className="bg-white/90 backdrop-blur-md rounded-lg px-4 py-2 shadow-lg border border-rose-200 max-w-xs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <p className="text-xs text-neutral-600 truncate">
                🎵 {currentTrack.name}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                by {currentTrack.artist_name}
              </p>
            </motion.div>
          )}
          
          <div className="flex gap-2">
            {/* Skip button */}
            {currentTrack && (
              <motion.button
                onClick={handleSkipTrack}
                className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-rose-200 flex items-center justify-center hover:scale-110 transition-transform"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Skip to next track"
                title="Skip track"
              >
                <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </motion.button>
            )}
            
            {/* Play/Pause button */}
            <motion.button
              onClick={togglePlay}
              className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-rose-200 flex items-center justify-center hover:scale-110 transition-transform"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isLoading ? (
                <svg className="w-6 h-6 text-rose-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : isPlaying ? (
                <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </motion.button>
          </div>
          
          {/* Error message */}
          {error && (
            <motion.div
              className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}

