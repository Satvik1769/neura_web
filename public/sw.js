/**
 * Service Worker for Push Notifications
 * Handles push events and notification clicks
 */

// Service Worker version
const CACHE_VERSION = 'v1';

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

/**
 * Handle Push Events
 */
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let notificationData = {
    title: 'Neura Alert',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {},
  };

  // Parse push notification data
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('Push data:', data);

      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || data.message || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || 'neura-notification',
        data: data.data || data,
        requireInteraction: data.requireInteraction || false,
        actions: data.actions || [],
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }

  console.log('📋 Final notification data:', notificationData);

  // Show notification with comprehensive error handling
  const notificationPromise = (async () => {
    try {
      console.log('🚀 Attempting to show notification...');

      // Check registration
      if (!self.registration) {
        throw new Error('Service worker registration not available');
      }
      console.log('✓ Service worker registration exists');

      // Prepare notification options
      const options = {
        body: notificationData.body,
        tag: notificationData.tag,
        data: notificationData.data,
        requireInteraction: true, // Force notification to stay visible
        vibrate: [200, 100, 200],
        // Note: icon and badge removed - add proper PNG files to use them
        // icon: '/icon-192x192.png',
        // badge: '/badge-72x72.png',
      };

      // Only add actions if not empty
      if (notificationData.actions && notificationData.actions.length > 0) {
        options.actions = notificationData.actions;
      }

      console.log('📝 Notification options:', options);

      // Show notification
      await self.registration.showNotification(notificationData.title, options);

      console.log('✅ Notification shown successfully!');
      console.log('Title:', notificationData.title);
      console.log('Body:', notificationData.body);

    } catch (error) {
      console.error('❌ FAILED TO SHOW NOTIFICATION');
      console.error('Error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Try showing a fallback notification
      try {
        console.log('🔄 Attempting fallback notification...');
        await self.registration.showNotification('Neura Alert', {
          body: 'You have a new notification (fallback)',
        });
        console.log('✅ Fallback notification shown');
      } catch (fallbackError) {
        console.error('❌ Even fallback notification failed:', fallbackError);
      }
    }
  })();

  event.waitUntil(notificationPromise);

  console.log('⏳ waitUntil called - event lifecycle extended');
});

/**
 * Handle Notification Click
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Handle action buttons
  if (event.action) {
    console.log('Action clicked:', event.action);
    // Handle different action types
    switch (event.action) {
      case 'view':
        // Navigate to specific page
        break;
      case 'dismiss':
        // Just close
        return;
      default:
        break;
    }
  }

  // Get the URL to open
  let urlToOpen = '/dashboard';

  // Check if notification has custom URL
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }

  // Open or focus the app
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

/**
 * Handle Push Subscription Change
 */
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('Push subscription changed:', event);

  event.waitUntil(
    // Re-subscribe with new subscription
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        console.log('Re-subscribed:', subscription);
        // Send new subscription to server
        return fetch('/api/pn/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });
      })
  );
});

/**
 * Handle Messages from Main Thread
 */
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
