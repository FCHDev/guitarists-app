import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const configInfos = {
  apiKey: `${process.env.REACT_APP_CLE_API}`,
  authDomain: `${process.env.GUITARIST_AUTH_DOMAIN}`,
  projectId: `${process.env.PROJECT_ID}`,
  storageBucket: `${process.env.STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.MESSAGING_SENDER_ID}`,
  appId: `${process.env.APP_ID}`,
  databaseURL:
    "https://peoples-to-buy-default-rtdb.europe-west1.firebasedatabase.app/",
};
const appFirebase = initializeApp(configInfos);

export const db = getDatabase(appFirebase);
export const auth = getAuth(appFirebase);
