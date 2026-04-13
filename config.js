// ─────────────────────────────────────────────────────────────
// Firebase Configuration
// Replace the values below with your Firebase project config.
// Get these from: Firebase Console → Project Settings → Your apps → SDK setup
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const db        = firebase.firestore();
const functions = firebase.functions();
