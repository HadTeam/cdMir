import sharp from 'sharp';
import {promises as fs} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateIcons() {
    // Define all sizes needed for PWA icons
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const sourceIcon = join(__dirname, '../../src/icons/icon.svg');
    const targetDir = join(__dirname, '../../public/icons');
    
    console.log(`Generating icons from ${sourceIcon} to ${targetDir}`);

    // Ensure target directory exists
    await fs.mkdir(targetDir, {recursive: true});

    // Generate standard icons
    for (const size of sizes) {
        const outputPath = join(targetDir, `icon-${size}x${size}.png`);
        await sharp(sourceIcon)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`Generated ${outputPath}`);
    }

    // Generate maskable icon (with padding)
    // Maskable icons need some safe zone padding for viewing on different platforms
    const maskableSize = 512;
    const maskablePadding = maskableSize * 0.1; // 10% padding
    const visibleSize = maskableSize - (2 * maskablePadding);
    
    await sharp(sourceIcon)
        .resize(Math.round(visibleSize), Math.round(visibleSize))
        .extend({
            top: Math.round(maskablePadding),
            bottom: Math.round(maskablePadding),
            left: Math.round(maskablePadding),
            right: Math.round(maskablePadding),
            background: '#0d47a1' // Same as icon background for seamless extension
        })
        .png()
        .toFile(join(targetDir, `maskable-icon-${maskableSize}x${maskableSize}.png`));
    console.log(`Generated maskable icon`);

    // Generate favicon (as PNG instead of ICO)
    await sharp(sourceIcon)
        .resize(32, 32)
        .png()
        .toFile(join(targetDir, 'favicon.png'));
    console.log(`Generated favicon.png`);
    
    // Also generate a 16x16 version for older browsers
    await sharp(sourceIcon)
        .resize(16, 16)
        .png()
        .toFile(join(targetDir, 'favicon-16x16.png'));
    console.log(`Generated favicon-16x16.png`);

    // Generate apple-touch-icon
    await sharp(sourceIcon)
        .resize(180, 180)
        .png()
        .toFile(join(targetDir, 'apple-touch-icon.png'));
    console.log(`Generated apple-touch-icon.png`);
}

// Run the function and handle any errors
generateIcons()
    .then(() => console.log('Icon generation complete!'))
    .catch(err => {
        console.error('Error generating icons:', err);
        process.exit(1);
    }); 