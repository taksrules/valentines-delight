'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundMusicProps {
  autoPlay?: boolean;
  occasionType?: string;
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
  autoPlay = true,
  occasionType,
  clientId = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID || 'cba118dc'
}: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<JamendoTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set to 30% volume for background ambiance
    }
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  // Auto-load and play music
  useEffect(() => {
    const startMusic = async () => {
      if (!currentTrack && !isLoading && !error) {
        const track = await loadRomanticMusic();
        if (track && audioRef.current) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (err) {
            console.log('Autoplay blocked, waiting for interaction');
            
            // Add global click listener to start music on first interaction
            const handleFirstInteraction = async () => {
              if (audioRef.current) {
                try {
                  await audioRef.current.play();
                  setIsPlaying(true);
                  window.removeEventListener('click', handleFirstInteraction);
                } catch (playErr) {
                  console.error('Play failed even after interaction:', playErr);
                }
              }
            };
            window.addEventListener('click', handleFirstInteraction);
          }
        }
      }
    };

    startMusic();
  }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Fetch romantic music from Jamendo API
  const loadRomanticMusic = async (): Promise<JamendoTrack | null> => {
    if (isLoading) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const searchUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&fuzzytags=romantic+piano+love&limit=5&audioformat=mp32`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const track = data.results[randomIndex];
        setCurrentTrack(track);
        
        if (audioRef.current) {
          audioRef.current.src = track.audio;
          console.log(`🎵 Ready: "${track.name}" by ${track.artist_name}`);
        }
        return track;
      } else {
        setError('No romantic tracks found');
        return null;
      }
    } catch (err) {
      console.error('Error fetching music:', err);
      setError('Failed to load music');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
      />
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
        <motion.button
          onClick={toggleMute}
          className="w-12 h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full shadow-lg border-2 border-rose-200 dark:border-neutral-800 flex items-center justify-center hover:scale-110 transition-transform"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isLoading ? (
            <svg className="w-5 h-5 text-rose-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isMuted ? (
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </motion.button>
        
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
    </>
  );
}

