import app from './firebase-config';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';

const db = getFirestore(app);

// Function to fetch messages
async function fetchMessages() {
  const messages = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'messages'));
    querySnapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error fetching messages: ", error);
  }
  return messages;
}

// Function to write a message with text and sender to Firestore
async function writeMessage(content, sender, timestamp) {
  try {
    // Create a new document with a generated ID in the 'messages' collection
    const docRef = doc(collection(db, "messages"));
    // Set the document data
    await setDoc(docRef, {
      content: content,
      sender: sender,
      timestamp: timestamp,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export { fetchMessages, writeMessage };