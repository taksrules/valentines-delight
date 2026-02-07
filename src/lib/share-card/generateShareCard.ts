import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { getFonts } from './fonts';
import { ShareCardLayout } from './ShareCardLayout';
import React from 'react';

/**
 * Generates a professional social share card as a PNG buffer.
 */
export async function generateShareCard(
  journey: { 
    id: string; 
    recipientName: string; 
    referralCode?: string | null;
    occasionType: string;
  },
  photoBuffer: Buffer
): Promise<Buffer> {
  // 1. Prepare Background Image with Sharp
  const resizedPhoto = await sharp(photoBuffer)
    .resize(1080, 1350, { fit: 'cover', position: 'center' })
    .modulate({
      brightness: 1.1,  // 10% brighter to counter vignette
      saturation: 1.05  // Slight saturation boost for punchier output
    })
    .sharpen() // Crisp up the photo for social sharing
    .toBuffer();
  
  const photoBase64 = `data:image/jpeg;base64,${resizedPhoto.toString('base64')}`;

  // 2. Generate QR Code
  const referralUrl = `https://tenderly.space?ref=${journey.referralCode || 'TNDRLY'}`;
  const qrBuffer = await QRCode.toBuffer(referralUrl, {
    width: 240,
    margin: 1,
    color: {
      dark: '#e11d48', // rose-600
      light: '#ffffff',
    },
  });
  const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

  // 3. Format Date with Ordinal (e.g., February 7th)
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const day = now.getDate();
  const getOrdinal = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  const dateStr = `${month} ${day}${getOrdinal(day)}`;

  // 4. Load Fonts
  const fonts = await getFonts();

  // 5. Generate SVG with Satori
  const svg = await satori(
    React.createElement(ShareCardLayout, {
      photoUrl: photoBase64,
      headline: "She said YES!",
      date: dateStr,
      qrCode: qrBase64,
      journeyId: journey.id,
    }),
    {
      width: 1080,
      height: 1350,
      fonts: [
        {
          name: 'Geist Regular',
          data: fonts.regular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Geist Bold',
          data: fonts.bold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  // 6. Rasterize SVG to PNG with Resvg
  const resvg = new Resvg(svg, {
    background: 'rgba(255, 255, 255, 0)',
    fitTo: {
      mode: 'width',
      value: 1080,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
