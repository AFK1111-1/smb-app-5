import notifee, {
  AndroidImportance,
  EventType,
  Trigger,
  TriggerType,
} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Callback type for in-app notifications
type InAppNotificationCallback = (data: {
  title: string;
  body: string;
}) => void;

/**
 * NotificationService - A comprehensive service for managing local and remote notifications
 * using Notifee and Firebase Cloud Messaging (FCM).
 *
 * Handles notification permissions, channels, display, scheduling, and FCM integration
 * for both iOS and Android platforms.
 *
 * @example
 * ```ts
 * import notificationService from './notificationService';
 *
 * // Get FCM token
 * const token = await notificationService.getFCMToken();
 *
 * // Display a notification
 * await notificationService.displayNotification({
 *   notification: { title: 'Hello', body: 'World' },
 *   data: { userId: '123' }
 * });
 * ```
 */

class NotificationService {
  private inAppNotificationCallback: InAppNotificationCallback | null = null;

  constructor() {
    this.configure();
  }
  /**
   * Configures the notification service by setting up permissions, channels, and handlers.
   *
   * - Requests notification permissions
   * - Registers device for remote messages (iOS)
   * - Creates notification channels (Android)
   * - Sets up message handlers for FCM
   * - Sets up foreground/background event handlers
   *
   * Called automatically in the constructor, but can also be called manually.
   */
  async configure() {
    // Request permissions
    await this.requestPermission();
    await messaging().subscribeToTopic('all_users');

    // Register for remote messages (iOS)
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    // Create notification channel (Android)
    await this.createChannel();

    // Set up message handlers
    this.setupMessageHandlers();

    // Set up foreground handler
    this.setupForegroundHandler();
  }

  /**
   * Requests notification permissions from the user.
   *
   * - **iOS**: Requests authorization for alerts, badges, and sounds
   * - **Android**: Requests permission through Notifee (Android 13+ requires runtime POST_NOTIFICATIONS)
   *
   * @note For Android 13+, ensure the following permission is in `AndroidManifest.xml`:
   * ```xml
   * <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
   * ```
   */
  async requestPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    }

    // Request Notifee permissions
    await notifee.requestPermission();
  }

  /**
   * Creates predefined notification channels for Android:
   * - `default` → Standard notifications with high importance
   * - `high-priority` → Important notifications with vibration
   *
   * No-op on iOS.
   */
  async createChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    await notifee.createChannel({
      id: 'high-priority',
      name: 'High Priority Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  }

  /**
   * Sets up Firebase Cloud Messaging handlers for background and foreground messages.
   *
   * Both handlers automatically call `displayNotification()` to show the notification.
   */
  setupMessageHandlers() {
    // Background & Quit state messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    // Foreground messages
    messaging().onMessage(async (remoteMessage) => {
      if (
        !remoteMessage.notification?.title ||
        !remoteMessage.notification?.body
      ) {
        return;
      }
      // Show in-app notification if callback is set
      if (this.inAppNotificationCallback && remoteMessage.notification) {
        this.inAppNotificationCallback({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
        });
      }

      await this.displayNotification(remoteMessage);
    });
  }

  /**
   * Sets up Notifee handlers for foreground and background notification events.
   *
   * Handles dismiss and press events for navigation or custom logic.
   */
  setupForegroundHandler() {
    // Handle notification events
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          // Handle navigation here
          break;
      }
    });

    // Handle background events
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      if (type === EventType.PRESS) {
        console.log('User pressed notification in background', notification);
        // Handle navigation
      }
    });
  }
  /**
   * Displays a push notification received via Firebase Cloud Messaging.
   */
  async displayNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    const { notification, data } = remoteMessage;
    const channelId = await notifee.createChannel({
      id: 'marketing',
      name: 'Marketing Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: notification?.title || 'New Notification',
      body: notification?.body || 'You have a new message',

      android: {
        channelId: channelId,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        largeIcon: notification?.image,
      },
      ios: {
        sound: 'default',
      },
      data: data,
    });
  }

  /**
   * Retrieves the FCM token for the device.
   *
   * @returns The FCM token, or `null` if retrieval fails.
   */
  async getFCMToken() {
    await this.requestPermission();
    try {
      // iOS requires explicit registration
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }

      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Schedules a local notification to appear at a given timestamp.
   */
  async scheduleNotification({
    title,
    body,
    timestamp,
  }: {
    title: string;
    body: string;
    timestamp: number;
  }) {
    const trigger: Trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: timestamp,
    };

    await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: 'default',
        },
      },
      trigger,
    );
  }

  /**
   * Cancels all scheduled and active notifications.
   */

  async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  /**
   * Registers a callback for when the FCM token is refreshed.
   */

  onTokenRefresh(callback: (token: string) => any) {
    return messaging().onTokenRefresh(callback);
  }

  /**
   * Registers a callback for in-app notifications.
   * This callback will be triggered when a foreground message is received.
   */
  setInAppNotificationCallback(callback: InAppNotificationCallback | null) {
    this.inAppNotificationCallback = callback;
  }

  /**
   * Removes the in-app notification callback.
   */
  removeInAppNotificationCallback() {
    this.inAppNotificationCallback = null;
  }
}

export default new NotificationService();
