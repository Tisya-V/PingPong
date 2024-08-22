import app from './firebase-config';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const db = getFirestore(app);
const auth = getAuth(app);

// Function to sign up a new user
async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.error("User already signed up: ", email);
    } else {
      console.error("Error signing up:", error.code, error.message);
    }  }
}


// Function to sign in an existing user
async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
    console.log('User signed in:', userCredential.user.uid);
    return userCredential.user.uid;

  } catch (error) {
    console.error('Error signing in:', error);
  }
}

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
async function writeMessage(message, sender, timestamp) {
  try {
    // Create a new document with a generated ID in the 'messages' collection
    const docRef = doc(collection(db, "messages"));
    // Set the document data
    await setDoc(docRef, {
      message: message,
      sender: sender,
      timestamp: timestamp,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getUserDoc(username) {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    for (const doc of querySnapshot.docs) {
      if (doc.data().nickname === username) {
        console.log("User found: ", doc.data());
        return doc;
      }
    }
  } catch (error) {
    console.error("Error fetching messages: ", error);
  }
  return null; 
}

async function getPassword(username) {
  const userDoc = await getUserDoc(username);
  if (userDoc) {
    return userDoc.data().password;
  }
  return null;
}

export { signIn, fetchMessages, writeMessage, getUserDoc, getPassword};