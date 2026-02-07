import fs from 'fs/promises';
import path from 'path';

let fontCache: {
  regular: ArrayBuffer;
  bold: ArrayBuffer;
} | null = null;

export async function getFonts() {
  if (fontCache) return fontCache;

  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  
  const [regular, bold] = await Promise.all([
    fs.readFile(path.join(fontsDir, 'Geist-Regular.ttf')),
    fs.readFile(path.join(fontsDir, 'Geist-Bold.ttf')),
  ]);

  fontCache = {
    regular: regular.buffer,
    bold: bold.buffer,
  };

  return fontCache;
}
