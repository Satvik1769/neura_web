/**
 * Push Notification Service
 * Handles Web Push Notifications registration, subscription, and management
 */

import { pushNotificationApi } from './api';

/**
 * URL-safe Base64 encoding for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  try {
    // Remove any whitespace and quotes
    const cleanedString = base64String.trim().replace(/['"]/g, '');

    // Add padding if needed
    const padding = '='.repeat((4 - (cleanedString.length % 4)) % 4);

    // Convert URL-safe base64 to standard base64
    const base64 = (cleanedString + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Decode base64 string
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  } catch (error) {
    console.error('Error converting VAPID key:', error);
    console.error('Original base64 string:', base64String);
    throw new Error(`Failed to decode VAPID public key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Workers are not supported in this browser');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    throw error;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription> {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  // Request permission if not already granted
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  // Get or register service worker
  let registration = await navigator.serviceWorker.getRegistration('/');
  if (!registration) {
    registration = await registerServiceWorker();
  }

  // Wait for service worker to be ready
  await navigator.serviceWorker.ready;

  try {
    // Get VAPID public key from server
    console.log('Fetching VAPID public key...');
    const vapidPublicKey = await pushNotificationApi.getVapidPublicKey();
    console.log('Received VAPID public key:', vapidPublicKey);
    console.log('VAPID key type:', typeof vapidPublicKey);
    console.log('VAPID key length:', vapidPublicKey.length);

    // Convert VAPID key
    console.log('Converting VAPID key to Uint8Array...');
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    console.log('Converted VAPID key length:', convertedVapidKey.length);

    // Subscribe to push notifications
    console.log('Subscribing to push manager...');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey as BufferSource,
    });

    // Send subscription to server
    console.log('Sending subscription to server...');
    await pushNotificationApi.subscribe(subscription);

    console.log('✅ Push notification subscription successful:', subscription);
    return subscription;
  } catch (error) {
    console.error('❌ Failed to subscribe to push notifications:', error);
    if (error instanceof Error) {
      throw new Error(`Subscription failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<void> {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  const registration = await navigator.serviceWorker.getRegistration('/');
  if (!registration) {
    console.warn('No service worker registration found');
    return;
  }

  try {
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      console.warn('No push subscription found');
      return;
    }

    // Unsubscribe from push manager
    const unsubscribed = await subscription.unsubscribe();
    if (unsubscribed) {
      // Notify server
      await pushNotificationApi.unsubscribe(subscription);
      console.log('Successfully unsubscribed from push notifications');
    }
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    throw error;
  }
}

/**
 * Get current push subscription
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    return null;
  }

  const registration = await navigator.serviceWorker.getRegistration('/');
  if (!registration) {
    return null;
  }

  return registration.pushManager.getSubscription();
}

/**
 * Check if user is currently subscribed
 */
export async function isSubscribed(): Promise<boolean> {
  const subscription = await getCurrentSubscription();
  return subscription !== null;
}
