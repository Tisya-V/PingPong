import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import { IconButton, PaperProvider, TextInput } from "react-native-paper";
import { ScrollView, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { fetchMessages, writeMessage } from "../store-procedures";
import { collection, onSnapshot, query, orderBy, getFirestore, Timestamp } from 'firebase/firestore';
import { app } from '../firebase-config';
import { SENDER } from './app-constants';



export default function Index() {
  
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const db = getFirestore(app);
  
  useEffect(() => {
    const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesArray);
      console.log(messagesArray)
    }, (error) => {
      console.error("Failed to subscribe to messages:", error);
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <PaperProvider>
    <ScrollView>
      <View style={styles.container}>
        {messages.map(m => (
          <Message key={m.id} message={m} />
        ))}
        <TextInput 
          placeholder="Start typing.."
          value={text}
          onChangeText={text => setText(text)}
          right= {<TextInput.Icon icon="send" 
                                  onPress={async () => {
                                    setText("")
                                    console.log("Sending " + text + " with sender " + SENDER) // Add your function here
                                    await writeMessage(text, SENDER, Timestamp.now());
                                    } }
                  />}
        />
      </View>
    </ScrollView>
    </PaperProvider>
    </TouchableWithoutFeedback>

  );
}

styles = StyleSheet.create({
  container : {
    padding:20,  }
})