import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SENDER } from "../app/app-constants";

export default function Message({ message }) {
    return (
        <View style={styles.container}>
            <Text style={(message.sender === SENDER) ? styles.yourMessage : styles.theirMessage}>{message.content}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: "center",
        // alignItems: "center",
    },
    yourMessage: {
        fontSize: 20,
        color: "green",
        alignSelf: "flex-end",
    },
    theirMessage: {
        fontSize: 20,
        color: "blue",
    },
    message: {
        fontSize: 20,
        color: "red",
    },
});