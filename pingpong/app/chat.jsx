import React, { useState, useEffect } from 'react';
import { ScrollView, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { app } from '../firebase-config';
import { writeMessage } from '../store-procedures';
import Message from '../components/Message';
import { Timestamp } from 'firebase/firestore';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { getAuth } from 'firebase/auth';

export default function Chat(props) {
    const userID = props.route.params.userID;
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
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
        console.error("Failed to subscribe to messages:", error, "Auth status", auth.currentUser);
      });
  
      // Clean up the subscription on component unmount
      return () => unsubscribe();
    }, []);
  
  
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView>
        <View style={styles.container}>
          {messages.map(m => (
            <Message key={m.id} message={m} userID={userID} />
          ))}
          <TextInput 
            placeholder="Start typing.."
            value={text}
            onChangeText={text => setText(text)}
            right= {<TextInput.Icon icon="send" 
                                    onPress={async () => {
                                      setText("")
                                      console.log("Sending " + text + " with sender " + userID)
                                      await writeMessage(text, userID, Timestamp.now());
                                      } }
                    />}
          />
        </View>
      </ScrollView>
   </TouchableWithoutFeedback>
  
    );
}

const styles = StyleSheet.create({
    container : {
      padding:20,  }
  })
  