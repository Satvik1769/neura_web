/**
 * Custom hook for managing push notifications
 */

import { useState, useEffect, useCallback } from 'react';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isSubscribed as checkIsSubscribed,
} from '@/lib/push-notifications';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check support and initial subscription status
  useEffect(() => {
    const checkSupport = () => {
      const supported = isPushNotificationSupported();
      setIsSupported(supported);

      if (supported) {
        setPermission(getNotificationPermission());
      }
    };

    const checkSubscriptionStatus = async () => {
      if (!isPushNotificationSupported()) {
        return;
      }

      try {
        const subscribed = await checkIsSubscribed();
        setIsSubscribed(subscribed);
      } catch (err) {
        console.error('Error checking subscription status:', err);
      }
    };

    checkSupport();
    checkSubscriptionStatus();
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await subscribeToPushNotifications();
      setIsSubscribed(true);
      setPermission('granted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe to notifications';
      setError(errorMessage);
      console.error('Subscription error:', err);

      // Update permission state
      setPermission(getNotificationPermission());
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await unsubscribeFromPushNotifications();
      setIsSubscribed(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe from notifications';
      setError(errorMessage);
      console.error('Unsubscription error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  };
}
