import React, {useState, useEffect, useRef} from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import app from '../firebase-config';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';


const db = getFirestore(app);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
async function registerForPushNotificationsAsync(userId) {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: true,
      });
    }

    const { status: status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log('Expo Push Token:', token);

    // Save token to Firestore
    if (token) {
      await saveTokenToFirestore(token, userId);
    }
}

async function saveTokenToFirestore(token, userId) {
// You might want to include a unique identifier for the user
try {
    console.log('Doc:', doc, "User:", userId);
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, {
        expoPushToken: token,
    }, { merge: true });

    console.log('Push token saved to Firestore');
} catch (error) {
    console.error('Error saving push token:', error);
}
}

async function sendPushNotification(expoPushToken, message) {
    const notificationMessage = {
      to: expoPushToken,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data || {},
    };
  
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationMessage),
      });
  
      const responseData = await response.json();
      console.log('Notification response:', responseData);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
}


export { sendPushNotification, registerForPushNotificationsAsync };
