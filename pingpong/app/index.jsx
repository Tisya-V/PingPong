import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import { IconButton, PaperProvider, TextInput } from "react-native-paper";
import { View } from "react-native";
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
    <PaperProvider>
      <View>
        {messages.map(m => (
          <Message key={m.id} message={m} />
        ))}
        <TextInput 
          placeholder="Start typing.."
          value={text}
          onChangeText={text => setText(text)}
          right= {<TextInput.Icon icon="send" 
                                  onPress={async () => {
                                    console.log("Sending " + text + " with sender " + SENDER) // Add your function here
                                    await writeMessage(text, SENDER, Timestamp.now());
                                    setText("")} }
                  />} // Add your icon button here
        />
      </View>
    </PaperProvider>
  );
}
