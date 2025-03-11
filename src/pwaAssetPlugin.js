// Custom plugin to ensure PWA assets are properly copied
// This handles the case where the service worker might not be able to access the icon files
import fs from 'fs-extra';
import path from 'path';

export default function pwaAssetPlugin() {
  return {
    name: 'vite-plugin-pwa-asset-copy',
    writeBundle: {
      sequential: true,
      order: 'post',
      handler: async (options) => {
        const publicDir = path.resolve(process.cwd(), 'public');
        const outDir = options.dir || path.resolve(process.cwd(), 'build');
        
        // Ensure the icons directory exists in the output
        const iconsSrcDir = path.join(publicDir, 'icons');
        const iconsDestDir = path.join(outDir, 'icons');
        
        if (fs.existsSync(iconsSrcDir)) {
          console.log('Copying PWA icons to build directory...');
          await fs.copy(iconsSrcDir, iconsDestDir);
        }
      }
    }
  };
} 