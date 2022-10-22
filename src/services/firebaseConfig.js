import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const configInfos = {
  apiKey: process.env.REACT_APP_CLE_API,
  authDomain: "peoples-to-buy.firebaseapp.com",
  projectId: "peoples-to-buy",
  storageBucket: "peoples-to-buy.appspot.com",
  messagingSenderId: "542939926158",
  appId: "1:542939926158:web:788c6b0e67dd4f14eec3df",
  databaseURL:
    "https://peoples-to-buy-default-rtdb.europe-west1.firebasedatabase.app/",
};

console.log(configInfos.apiKey)

export const appFirebase = initializeApp(configInfos);
export const db = getDatabase(appFirebase);
export const storage = getStorage(appFirebase);
export const auth = getAuth(appFirebase);
export const refDb = (a, b) => {
  return ref(a, b);
};
