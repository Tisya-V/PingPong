import React from "react";
import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { getUserDoc } from "../store-procedures";
 


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
                            let userDoc = await getUserDoc(username);
                            console.log(userDoc);
                            if (userDoc.data().password === password) {
                                console.log("Login successful. UserID: ", userDoc.id);
                                navigation.navigate("Chat", {userID: userDoc.id});
                            } else {
                                console.log("Login failed");
                            }
                        } catch (error) {
                            console.error("Error fetching user document:", error);
                        }
                    }
                }
            >Login</Button>
        </View>    
    )
}