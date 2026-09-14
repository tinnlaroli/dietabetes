import sharp from 'sharp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const salida = resolve(__dirname, '..', 'public', 'icons');
await mkdir(salida, { recursive: true });

const tamanos = [72, 96, 128, 144, 152, 192, 384, 512];

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#2e7d32"/>
  <circle cx="256" cy="256" r="150" fill="#faf7f1"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="#faf7f1" stroke-width="34"/>
  <circle cx="256" cy="268" r="78" fill="none" stroke="#2e7d32" stroke-width="26"/>
  <rect x="256" y="186" width="60" height="136" rx="30" fill="#2e7d32"/>
</svg>`;

for (const tamano of tamanos) {
  const ruta = resolve(salida, `icon-${tamano}x${tamano}.png`);
  await sharp(Buffer.from(svg)).resize(tamano, tamano).png().toFile(ruta);
  console.log(`Generado icon-${tamano}x${tamano}.png`);
}