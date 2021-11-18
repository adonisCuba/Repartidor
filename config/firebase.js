import { initializeApp } from "firebase/app";
import "firebase/auth";
import Constants from "expo-constants";

// Inicializando Firebase
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

export const Firebase = initializeApp(firebaseConfig);
