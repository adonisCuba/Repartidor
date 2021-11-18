import React, { useContext, useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, Text, Platform } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { AuthenticatedUserContext } from "./AuthenticatedUserProvider";
import AuthStack from "./AuthStack";
import "../config/firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import * as SecureStore from "expo-secure-store";
import BusinessStack from "./BusinessStack";
import DeliveryBoyStack from "./DeliveryBoyStack";
import * as Notifications from "expo-notifications";
import NoUserTypeStack from "./NoUserTypeStack";

const auth = getAuth();

export default function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const onAuthenticated = async (authenticatedUser) => {
    const db = getFirestore();
    const q = query(
      collection(db, "typeUsers"),
      where("userId", "==", authenticatedUser.uid),
      limit(1)
    );
    const queryResult = await getDocs(q);
    queryResult.forEach((doc) => {
      setUserRole(doc.data().typeUser);
      console.log(doc.data().typeUser);
      if (Platform.OS != "web") {
        SecureStore.setItemAsync("userRole", doc.data().typeUser);
        SecureStore.setItemAsync("expoPushToken", doc.data().expoPushToken);
      }
    });
    setUser(authenticatedUser);
    // Se dispara cuando la nitificacion se recive mientras la app esta foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    // Se dispara cuando el usuario selecciona la notificacion (funciona en cualquier estado de la app)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
  };

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        try {
          await (authenticatedUser
            ? onAuthenticated(authenticatedUser)
            : setUser(null));
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    );

    // unsubscribe auth listener on unmount
    return () => {
      unsubscribeAuth;
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        userRole == "business" ? (
          <BusinessStack />
        ) : userRole == "delivery boy" ? (
          <DeliveryBoyStack />
        ) : (
          <NoUserTypeStack />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
