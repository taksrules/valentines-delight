import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/rate-limit';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';
import { generateShareCard } from '@/lib/share-card/generateShareCard';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check Redis Cache First
    const cacheKey = `share-card:v3:${id}`;
    const cachedImage = await redis.get<string>(cacheKey);
    
    if (cachedImage) {
      console.log(`[ShareCard] Cache hit for ${id}`);
      const buffer = Buffer.from(cachedImage, 'base64');
      return new Response(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Fetch Journey Data
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { photoOrder: 'asc' },
          take: 1
        }
      }
    });

    if (!journey) {
      return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
    }

    // 3. Determine Photo to use
    const photoUrl = journey.successPhotoUrl || journey.photos[0]?.imageUrl;
    if (!photoUrl) {
      return NextResponse.json({ success: false, error: 'No photo found' }, { status: 404 });
    }

    // 4. Fetch Image Buffer
    let photoBuffer: Buffer;
    try {
      const urlObj = new URL(photoUrl);
      let bucket = '';
      let key = '';

      if (photoUrl.includes('/storage/v1/object/public/')) {
        const parts = urlObj.pathname.split('/public/');
        if (parts.length > 1) {
          const fullPath = parts[1];
          const pathParts = fullPath.split('/');
          bucket = pathParts[0];
          key = pathParts.slice(1).join('/');
        }
      } else if (photoUrl.includes('/storage/v1/s3/')) {
        const s3Match = photoUrl.match(/\/storage\/v1\/s3\/([^/]+)\/(.+?)(?:\?|$)/);
        if (s3Match) {
          bucket = s3Match[1];
          key = s3Match[2];
        }
      }

      if (bucket && key) {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const response = await s3Client.send(command);
        const arrayBuffer = await response.Body?.transformToByteArray();
        if (!arrayBuffer) throw new Error('Empty body');
        photoBuffer = Buffer.from(arrayBuffer);
      } else {
        const response = await fetch(photoUrl);
        photoBuffer = Buffer.from(await response.arrayBuffer());
      }
    } catch (err) {
      console.error('[ShareCard] Failed to fetch photo:', err);
      return NextResponse.json({ success: false, error: 'Failed to fetch source image' }, { status: 500 });
    }

    // 5. Generate Share Card
    console.log(`[ShareCard] Generating for ${id}...`);
    const pngBuffer = await generateShareCard(
      {
        id: journey.id,
        recipientName: journey.recipientName,
        referralCode: journey.referralCode,
        occasionType: journey.occasionType
      },
      photoBuffer
    );

    // 6. Cache in Redis (30 Days)
    try {
      await redis.set(cacheKey, pngBuffer.toString('base64'), { ex: 2592000 });
    } catch (err) {
      console.error('[ShareCard] Redis caching failed:', err);
    }

    // 7. Return Response
    return new Response(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'MISS'
      },
    });

  } catch (error) {
    console.error('[ShareCard] Internal error:', error);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }
}
