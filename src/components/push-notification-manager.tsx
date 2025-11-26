'use client';

import { useEffect } from 'react';

export function PushNotificationManager() {
  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission has been granted.');
        } else {
          console.log('Notification permission has been denied.');
        }
      });
    }
  }, []);

  return null;
}
