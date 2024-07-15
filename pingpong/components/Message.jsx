import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SENDER } from "../app/app-constants";

export default function Message({ message, userID}) {
    console.log("Message: ", message);
    console.log("UserID: ", userID);
    return (
        <View  style={[styles.message, (message.sender === userID) ? styles.yourMessage : styles.theirMessage]}>
            <Text style={styles.text}>{message.content}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    message: {
        flexDirection: "row",
        padding: 10,
        margin: 5,
        borderRadius: 10,
        justifyContent: "center",
    },
    theirMessage: {
        alignSelf: "flex-start",
        backgroundColor: "green",
    },
    yourMessage: {
        alignSelf: "flex-end",
        backgroundColor: "red",
    },
    text: {
        fontSize: 20,
        color: "black",
    },
});