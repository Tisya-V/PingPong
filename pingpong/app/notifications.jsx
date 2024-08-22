import React, {useState, useEffect, useRef} from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
export default function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState([]);
    const [notification, setNotification] = useState(undefined);
    const notificationListener = useRef();
    const responseListener = useRef();
  
    useEffect(() => {
        // Request permission to send notifications
        const requestNotificationPermissions = async () => {
            const settings = await Notifications.requestPermissionsAsync();
            if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
                console.log('Notification permissions granted.');
            }
        };
    
        requestNotificationPermissions();
    
        // Optionally, define notification handling while the app is in the foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received in the app:', notification);
        });
    
        return () => {
            // Clean up: Remove the notification listener
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
        };
    }, []);


    return { expoPushToken, channels, notification }
}

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here', test: { test1: 'more data' } },
        },
        trigger: null,
    });
}   

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            Alert.alert('Failed to get push token for push notification!');
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // EAS projectId is used here.
        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found');
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(token);
        } catch (e) {
            token = `${e}`;
        }
    } else {
        Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
}

export { schedulePushNotification, registerForPushNotificationsAsync };
