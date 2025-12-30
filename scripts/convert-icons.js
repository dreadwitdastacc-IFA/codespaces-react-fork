const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [192, 256, 512];
const publicImages = path.join(__dirname, '..', 'public', 'images');

async function convert() {
  if (!fs.existsSync(publicImages)) {
    fs.mkdirSync(publicImages, { recursive: true });
  }

  for (const size of sizes) {
    const svgPath = path.join(publicImages, `icon-${size}x${size}.svg`);
    const pngPath = path.join(publicImages, `icon-${size}x${size}.png`);

    if (!fs.existsSync(svgPath)) {
      console.warn(`SVG not found: ${svgPath}, skipping`);
      continue;
    }

    try {
      const svgBuffer = fs.readFileSync(svgPath);
      await sharp(svgBuffer)
        .resize(size, size, { fit: 'contain' })
        .png({ quality: 90 })
        .toFile(pngPath);
      console.log(`Created ${pngPath}`);
    } catch (err) {
      console.error('Failed to convert', svgPath, err);
    }
  }
}

convert();
