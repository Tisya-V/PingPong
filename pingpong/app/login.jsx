import React, { useRef, useState } from "react";
import { View, Text, Platform } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { signIn } from "../store-procedures";
import { schedulePushNotification, registerForPushNotificationsAsync } from "./notifications";
import * as Notifications from 'expo-notifications';


export default function Login({navigation}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const notificationListener = useRef();
    const responseListener = useRef();

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" 
                    onPress={ async () => {
                        try {
                            const userId = await signIn(username, password);
                            if (userId !== null) {
                                console.log("Login successful. UserID: ", userId);
                                await registerForPushNotificationsAsync(userId);

                            if (Platform.OS === 'android') {
                                Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
                                }
                            
                                notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                                setNotification(notification);
                                });
                            
                                responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                                console.log(response);
                                });
                                
                                console.log("Registered for push notifications");
                                navigation.navigate("Chat", {userID: userId});
                            } else {
                                console.log("Login failed");
                            }
                        } catch (error) {
                            console.error("Error fetching user document:", error);
                        }
                    }
                }
            >Login</Button>
            <Button
                title="TEST NOTIFICATION"
                onPress={async () => {
                 await schedulePushNotification();
                 console.log("Notification scheduled");
                }}
            >Schedule Notification</Button>
        </View>    
    )
}