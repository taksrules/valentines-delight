import { NextResponse } from 'next/server';
import { searchTracks } from '@/lib/audius';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get('mood') || 'romantic';
  
  const apiKey = process.env.AUDIUS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Audius API Key not configured' }, { status: 500 });
  }

  try {
    const audiusTracks = await searchTracks(mood, 10);

    if (!audiusTracks || audiusTracks.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Map Audius response to our internal results format
    const results = audiusTracks.map((track: any) => ({
      id: track.id,
      name: track.title,
      artist_name: track.user.name,
      duration: track.duration,
      artwork: track.artwork?.["480x480"] || track.artwork?.["150x150"]
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error in music API route:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    // Return empty results instead of 500 to prevent UI hard-errors
    return NextResponse.json({ results: [] });
  }
}
