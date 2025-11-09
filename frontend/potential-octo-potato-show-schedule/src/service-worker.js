import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST || []);

cleanupOutdatedCaches();

registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images-cache',
  })
);
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
  }
});
