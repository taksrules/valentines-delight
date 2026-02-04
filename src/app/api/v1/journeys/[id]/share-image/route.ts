import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Fetch Journey Data
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

    // 2. Determine Photo to use (Success Photo preferred)
    const photoUrl = journey.successPhotoUrl || journey.photos[0]?.imageUrl;
    if (!photoUrl) {
      return NextResponse.json({ success: false, error: 'No photo found for image generation' }, { status: 400 });
    }

    // 3. Fetch Image Buffer from S3
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
        if (!arrayBuffer) throw new Error('Empty response body');
        photoBuffer = Buffer.from(arrayBuffer);
      } else {
        // Fallback for direct URLs
        const response = await fetch(photoUrl);
        photoBuffer = Buffer.from(await response.arrayBuffer());
      }
    } catch (err) {
      console.error('Failed to fetch photo buffer:', err);
      return NextResponse.json({ success: false, error: 'Failed to fetch source image' }, { status: 500 });
    }

    // 4. Generate QR Code Buffer
    const referralUrl = `https://tenderly.app?ref=${journey.referralCode || 'TNDRLY'}`;
    const qrBuffer = await QRCode.toBuffer(referralUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: '#e11d48', // rose-600
        light: '#ffffff',
      },
    });

    // 5. Image Dimensions & Quality
    const WIDTH = 1080;
    const HEIGHT = 1350;
    const dateStr = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // 6. Construct SVG Overlay (Text & Branding)
    // SVG is perfect for crisp text rendering on Sharp
    const svgOverlay = Buffer.from(`
      <svg width="${WIDTH}" height="${HEIGHT}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0);stop-opacity:0" />
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.6);stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Bottom Shaded Area -->
        <rect x="0" y="${HEIGHT * 0.7}" width="${WIDTH}" height="${HEIGHT * 0.3}" fill="url(#grad)" />

        <!-- Headline -->
        <text 
          x="${WIDTH / 2}" 
          y="${HEIGHT * 0.75}" 
          font-family="Arial, sans-serif" 
          font-size="80" 
          font-weight="bold" 
          fill="#e11d48" 
          text-anchor="middle"
          filter="drop-shadow(0 4px 4px rgba(0,0,0,0.3))"
        >
          She said YES! 💕
        </text>

        <!-- Date -->
        <text 
          x="${WIDTH / 2}" 
          y="${HEIGHT * 0.82}" 
          font-family="Arial, sans-serif" 
          font-size="32" 
          fill="white" 
          text-anchor="middle"
          opacity="0.9"
        >
          ${dateStr}
        </text>

        <!-- Branding Bottom Left -->
        <text 
          x="80" 
          y="${HEIGHT - 120}" 
          font-family="Arial, sans-serif" 
          font-size="48" 
          font-weight="bold" 
          fill="#e11d48"
        >
          Tenderly
        </text>
        <text 
          x="80" 
          y="${HEIGHT - 70}" 
          font-family="Arial, sans-serif" 
          font-size="24" 
          fill="white" 
          opacity="0.8"
        >
          Create your own moment at <tspan font-weight="bold">tenderly.app</tspan>
        </text>

        <!-- Code Watermark -->
        <text 
          x="${WIDTH - 80}" 
          y="${HEIGHT - 40}" 
          font-family="monospace" 
          font-size="18" 
          fill="white" 
          text-anchor="end" 
          opacity="0.4"
        >
          #${journey.referralCode || 'TNDRLY'}
        </text>
      </svg>
    `);

    // 7. Composite Image
    // First, prepare the background image
    const backgroundImage = await sharp(photoBuffer)
      .resize(WIDTH, HEIGHT, { fit: 'cover' })
      .toBuffer();

    // Prepare the overlay (SVG is already WIDTHxHEIGHT, but density affects rasterization size)
    // Sharp's composite requires exact matching dimensions if not providing top/left or if fitting
    const overlayBuffer = await sharp(svgOverlay, { density: 144 })
      .resize(WIDTH, HEIGHT) // Force exact match to avoid "must have same dimensions" error
      .toBuffer();

    const finalImage = await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: { r: 255, g: 241, b: 242 } // rose-50
      }
    })
    .composite([
      {
        input: backgroundImage,
        top: 0,
        left: 0,
      },
      {
        input: overlayBuffer,
        top: 0,
        left: 0,
      },
      // QR Code (Bottom Right)
      {
        input: await sharp(qrBuffer)
          .resize(180, 180)
          .toBuffer(),
        top: HEIGHT - 240,
        left: WIDTH - 260,
      }
    ])
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

    // 8. Return PNG
    return new Response(new Uint8Array(finalImage), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="tenderly-moment-${journey.referralCode}.png"`,
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error generating share image:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
