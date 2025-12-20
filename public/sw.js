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

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      vibrate: [200, 100, 200],
    })
  );
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
