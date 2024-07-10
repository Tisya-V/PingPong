// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCa9nXs02iDln-m51djJpwQJb8TRHsvby4",
  authDomain: "pingpong-50db4.firebaseapp.com",
  projectId: "pingpong-50db4",
  storageBucket: "pingpong-50db4.appspot.com",
  messagingSenderId: "435653088427",
  appId: "1:435653088427:web:3e639b5811cbf6622893ee",
  measurementId: "G-WZGZ75CVPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;