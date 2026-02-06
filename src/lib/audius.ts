export async function searchTracks(mood: string, limit = 20) {
  const AUDIUS_API_KEY = process.env.AUDIUS_API_KEY;
  
  const searchQueries: Record<string, string> = {
    romantic: "love romantic emotional piano",
    nostalgic: "memories nostalgic emotional",
    celebratory: "happy celebration upbeat joyful",
    melancholic: "sad emotional piano melancholic"
  };
  
  const query = searchQueries[mood] || mood;
  
  // Audius requires an API key for search
  const response = await fetch(
    `https://api.audius.co/v1/tracks/search?` +
    `query=${encodeURIComponent(query)}` +
    `&api_key=${AUDIUS_API_KEY}` +
    `&limit=${limit}`
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Audius API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data.data;
}

export function getStreamUrl(trackId: string) {
  // Streaming doesn't necessarily require the API key in the URL if using the redirect logic
  return `https://api.audius.co/v1/tracks/${trackId}/stream?app_name=TENDERLY`;
}
