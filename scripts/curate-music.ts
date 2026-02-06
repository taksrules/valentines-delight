import { searchTracks } from '../src/lib/audius';
import { prisma } from '../src/lib/prisma';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const moods = ['romantic', 'nostalgic', 'celebratory', 'melancholic', 'lofi', 'chill', 'ambient', 'pop'];

async function curateTracks() {
  console.log('--- Audius Curation Script ---');
  
  if (!process.env.AUDIUS_API_KEY) {
    console.error('Error: AUDIUS_API_KEY is missing in .env.local');
    return;
  }

  let totalUpserted = 0;

  for (const mood of moods) {
    console.log(`\n=== Searching ${mood} tracks ===`);
    
    try {
      const tracks = await searchTracks(mood, 30);
      console.log(`Found ${tracks.length} tracks on Audius`);
      
      for (const track of tracks) {
        try {
          await prisma.musicTrack.upsert({
            where: { audiusTrackId: track.id },
            update: {
              title: track.title,
              artist: track.user.name,
              mood: mood,
              duration: track.duration,
              artworkUrl: track.artwork?.['150x150'] || track.artwork?.['480x480'] || null,
            },
            create: {
              audiusTrackId: track.id,
              title: track.title,
              artist: track.user.name,
              mood: mood,
              duration: track.duration,
              artworkUrl: track.artwork?.['150x150'] || track.artwork?.['480x480'] || null,
            },
          });
          totalUpserted++;
        } catch (dbError) {
          console.error(`Failed to upsert track ${track.title}:`, dbError);
        }
      }
      console.log(`Completed ${mood} curation.`);
    } catch (error) {
      console.error(`Error searching ${mood}:`, error);
    }
  }

  console.log(`\n--- Finished! Total tracks processed/updated: ${totalUpserted} ---`);
}

curateTracks()
  .catch(err => console.error('Script failed:', err))
  .finally(() => prisma.$disconnect());
