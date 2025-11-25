// NotificationProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import InAppNotification from '@/components/Notification/InAppNotification';
import notificationService from '@/services/notificationService';

const NotificationContext = createContext({} as any);

interface NotificationProviderProps {
  children: React.ReactNode;
}
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<any>(null);

  const showInAppNotification = (data: any) => {
    setNotification(data);
  };

  const hideNotification = () => setNotification(null);

  useEffect(() => {
    // Register the callback with the notification service
    notificationService.setInAppNotificationCallback(showInAppNotification);

    // Cleanup on unmount
    return () => {
      notificationService.removeInAppNotificationCallback();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ showInAppNotification }}>
      {children}
      {notification && (
        <InAppNotification
          visible={!!notification}
          title={notification.title}
          body={notification.body}
          onHide={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
