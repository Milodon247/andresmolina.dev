// Regenerates the raster icons and the Open Graph image from their SVG sources.
// Run manually after editing public/favicon.svg or design/og-default.svg: `npm run images`.
// Uses sharp, which Astro already installs for image optimization.
import sharp from 'sharp';

const icons = [
  { size: 180, out: 'public/apple-touch-icon.png' },
  { size: 192, out: 'public/icon-192.png' },
  { size: 512, out: 'public/icon-512.png' },
];

for (const { size, out } of icons) {
  await sharp('public/favicon.svg', { density: 600 }).resize(size, size).png().toFile(out);
  console.log(`wrote ${out}`);
}

await sharp('design/og-default.svg').resize(1200, 630).png({ compressionLevel: 9 }).toFile('public/og/default.png');
console.log('wrote public/og/default.png');
