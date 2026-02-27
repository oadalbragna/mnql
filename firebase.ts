
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB3N5wtDfzBVcU5qxt7divPM7ObL56btI0",
  authDomain: "all-project-123.firebaseapp.com",
  databaseURL: "https://all-project-123-default-rtdb.firebaseio.com",
  projectId: "all-project-123",
  storageBucket: "all-project-123.firebasestorage.app",
  messagingSenderId: "1008602333230",
  appId: "1:1008602333230:web:72ce4bbe16ca96d5661fbf",
  measurementId: "G-CL0SSVRJ9L"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
