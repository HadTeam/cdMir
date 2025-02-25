export const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      // Check for updates periodically
      setInterval(async () => {
        await registration.update();
      }, 60 * 60 * 1000); // Check every hour
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              const event = new Event('sw-update-available');
              window.dispatchEvent(event);
            }
          });
        }
      });
      
      // Handle update acceptance
      window.addEventListener('sw-update-accepted', () => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
      
      // Handle controller change (new SW takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
      
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
}; 