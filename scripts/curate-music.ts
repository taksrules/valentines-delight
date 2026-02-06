import { searchTracks } from '../src/lib/audius';
import { prisma } from '../src/lib/prisma';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const moods = ['romantic', 'nostalgic', 'celebratory', 'melancholic'];

async function curateTracks() {
  console.log('--- Audius Curation Script ---');
  
  if (!process.env.AUDIUS_API_KEY) {
    console.error('Error: AUDIUS_API_KEY is missing in .env.local');
    return;
  }

  for (const mood of moods) {
    console.log(`\n=== Searching ${mood} tracks ===`);
    
    try {
      const tracks = await searchTracks(mood, 30);
      
      console.log(`Found ${tracks.length} tracks`);
      
      tracks.forEach((track: any, index: number) => {
        console.log(`${index + 1}. ${track.title} by ${track.user.name}`);
        console.log(`   ID: ${track.id}`);
        console.log(`   Stream: https://audius.co/tracks/${track.id}/stream`);
        console.log(`   Mood: ${track.mood || 'Not tagged'}`);
        console.log('');
      });
    } catch (error) {
      console.error(`Error searching ${mood}:`, error);
    }
  }

  console.log('\nUse "INSERT INTO music_tracks..." into your database to curate specific tracks.');
}

curateTracks();
