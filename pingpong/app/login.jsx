import React from "react";
import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { signIn } from "../store-procedures";
import { schedulePushNotification } from "./notifications";


export default function Login({navigation}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
                title="Press to schedule a notification"
                onPress={async () => {
                 await schedulePushNotification();
                 console.log("Notification scheduled");
                }}
            >Schedule Notification</Button>
        </View>    
    )
}