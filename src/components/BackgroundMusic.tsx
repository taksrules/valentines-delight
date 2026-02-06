'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundMusicProps {
  autoPlay?: boolean;
  mood?: string;
  className?: string;
  initialTrack?: {
    audiusTrackId: string;
    title: string;
    artist: string;
  } | null;
}

export default function BackgroundMusic({ 
  autoPlay = true,
  mood = 'romantic',
  className = "",
  initialTrack
}: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Audius Stream URL construction
  const getStreamUrl = (trackId: string) => `https://api.audius.co/v1/tracks/${trackId}/stream?app_name=TENDERLY`;

  const fetchFallbackMusic = useCallback(async () => {
    if (isLoading || currentTrack) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/music?mood=${encodeURIComponent(mood)}`);
      if (!response.ok) throw new Error('Failed to fetch music');
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const track = data.results[0];
        setCurrentTrack({
          audiusTrackId: track.id, // Using internal API response mapping
          title: track.name,
          artist: track.artist_name
        });
      }
    } catch (err) {
      console.error('Music Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mood, isLoading, currentTrack]);

  useEffect(() => {
    if (!currentTrack) {
      fetchFallbackMusic();
    }
  }, [currentTrack, fetchFallbackMusic]);

  // Handle Playback
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = getStreamUrl(currentTrack.audiusTrackId);
      if (autoPlay || isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              console.log('Autoplay blocked, waiting for interaction');
              setIsPlaying(false);
              // Fallback interaction listener - more aggressive
              const handleInteraction = () => {
                if (audioRef.current && audioRef.current.paused) {
                  audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {});
                }
                
                // Cleanup all listeners
                ['click', 'mousemove', 'scroll', 'touchstart', 'mousedown'].forEach(evt => 
                  window.removeEventListener(evt, handleInteraction)
                );
              };
              ['click', 'mousemove', 'scroll', 'touchstart', 'mousedown'].forEach(evt => 
                window.addEventListener(evt, handleInteraction, { once: true })
              );
            });
        }
      }
    }
  }, [currentTrack, autoPlay]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  if (!currentTrack && !isLoading) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 ${className}`}>
      <AnimatePresence>
        {isPlaying && currentTrack && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-rose-100 dark:border-rose-500/20 hidden md:flex flex-col gap-0.5 overflow-hidden max-w-[200px]"
          >
            <p className="text-[9px] uppercase tracking-widest text-rose-500 font-bold">Now Playing</p>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">
              {currentTrack.title}
            </p>
            <p className="text-[10px] text-neutral-500 truncate italic">
              Music by {currentTrack.artist} via Audius
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        <motion.button
          onClick={togglePlay}
          className="w-12 h-12 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full shadow-lg border-2 border-rose-200 dark:border-rose-500/30 flex items-center justify-center hover:scale-105 transition-all text-rose-500 active:scale-95"
          whileHover={{ y: -2 }}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </motion.button>

        <motion.button
          onClick={toggleMute}
          className="w-8 h-8 self-end bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full shadow border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors text-neutral-500"
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </motion.button>
      </div>

      <audio
        ref={audioRef}
        onError={(e) => {
          console.error("Audio Playback Error:", e);
          setError("Codec not supported or stream unreachable");
        }}
      />
    </div>
  );
}

