import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENABLED_KEY = 'notificationsEnabled';

export const getNotificationsEnabled = async () => {
  const v = await AsyncStorage.getItem(ENABLED_KEY);
  return v === null ? true : v === '1'; // domyślnie włączone
};

export const setNotificationsEnabled = async (enabled) => {
  await AsyncStorage.setItem(ENABLED_KEY, enabled ? '1' : '0');
};

// Pokazuj powiadomienia także gdy apka jest na pierwszym planie.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = 'reminders';

// Nasz harmonogram: 0=Nd..6=Sob. Expo weekly trigger: 1=Nd..7=Sob.
const toExpoWeekday = (day) => day + 1;

// Uprawnienia + kanał Android. Zwraca true jeśli mamy zgodę.
export const registerForNotifications = async () => {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Przypomnienia o misjach',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      finalStatus = req.status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.warn('registerForNotifications error:', e);
    return false;
  }
};

// Kasuje wszystkie zaplanowane i planuje od nowa na podstawie aktualnych misji.
export const syncReminders = async (quests = []) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Globalny włącznik z ustawień — gdy wyłączony, nic nie planujemy.
    const enabled = await getNotificationsEnabled();
    if (!enabled) return;

    for (const quest of quests) {
      if (!quest.reminderEnabled || !quest.reminderTime) continue;

      const [hStr, mStr] = quest.reminderTime.split(':');
      const hour = parseInt(hStr, 10);
      const minute = parseInt(mStr, 10);
      if (Number.isNaN(hour) || Number.isNaN(minute)) continue;

      const days = quest.schedule && quest.schedule.length > 0
        ? quest.schedule
        : [0, 1, 2, 3, 4, 5, 6];

      // Jeden tygodniowy trigger na każdy dzień z harmonogramu.
      for (const day of days) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${quest.categoryId?.icon || '⏰'} ${quest.title}`,
            body: 'Czas na Twoją misję! 💪',
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: toExpoWeekday(day),
            hour,
            minute,
            channelId: CHANNEL_ID,
          },
        });
      }
    }
  } catch (e) {
    console.warn('syncReminders error:', e);
  }
};

// Wyłączenie wszystkich przypomnień (globalny toggle).
export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('cancelAllReminders error:', e);
  }
};
