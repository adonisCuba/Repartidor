import React, { useEffect } from "react";
import { useState } from "react";
import {
  Center,
  Input,
  NativeBaseProvider,
  Stack,
  Icon,
  Heading,
  Divider,
  HStack,
  Button,
  Pressable,
  VStack,
  Text,
  IconButton,
  CloseIcon,
  Alert,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  FacebookAuthProvider,
} from "@firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import * as Facebook from "expo-facebook";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import { LogBox, Platform } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);

export const SignupScreen = ({ route, navigation }) => {
  const { typeUser } = route.params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [rightIcon, setRightIcon] = useState("eye-off");
  const [signError, setSignError] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  useEffect(async () => {
    await registerForPushNotificationsAsync();
  }, []);

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const onHandleSignup = async () => {
    try {
      if (email !== "" && password !== "") {
        const auth = getAuth();
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await saveUserType(result);
      }
    } catch (error) {
      setSignError(error.message);
    }
  };
  const onHandleSignupFacebook = async () => {
    const auth = getAuth();
    auth.languageCode = "es";
    try {
      const appId = Constants.manifest.extra.facebookAppId;
      await Facebook.initializeAsync({ appId });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      if (type === "success") {
        const credential = FacebookAuthProvider.credential(token);
        const result = await signInWithCredential(auth, credential);
        await saveUserType(result);
      }
    } catch (error) {
      setSignError(error.message);
    }
  };
  const saveUserType = async (credentials) => {
    const firestore = getFirestore();
    try {
      await addDoc(collection(firestore, "typeUsers"), {
        userId: credentials.user.uid,
        typeUser,
        expoPushToken,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
    } else alert("Must use physical device for Push Notifications");
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" bg="white">
        <Stack space={4} w="100%" alignItems="center">
          <Heading textAlign="center" mb="10">
            Registrar usuario
          </Heading>
          <Input
            w="75%"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            InputLeftElement={
              <Icon
                as={<Ionicons name="mail" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
          />
          <Input
            w="75%"
            placeholder="Contraseña"
            type={passwordVisibility ? "text" : "password"}
            value={password}
            onChangeText={(text) => setPassword(text)}
            InputRightElement={
              <Pressable onPress={handlePasswordVisibility}>
                <Icon
                  as={<Ionicons name={rightIcon} />}
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              </Pressable>
            }
          />
          <HStack>
            <Button
              mr={2}
              leftIcon={<Icon as={<Ionicons name="checkmark" />} />}
              onPress={onHandleSignup}
            >
              Registarse
            </Button>
            <Button
              ml={2}
              variant="subtle"
              leftIcon={<Icon as={<Ionicons name="log-in" />} />}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              Ir al login
            </Button>
          </HStack>
          <Divider w="75%" />
          <HStack>
            <Button
              colorScheme="info"
              shadow="1"
              variant="subtle"
              mt="2"
              size="md"
              leftIcon={<Icon as={<Ionicons name="logo-facebook" />} />}
              onPress={onHandleSignupFacebook}
            >
              Facebook
            </Button>
          </HStack>
        </Stack>
        {signError ? (
          <Alert status="error" mt={5}>
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    {signError}
                  </Text>
                </HStack>
                <IconButton
                  variant="unstyled"
                  icon={<CloseIcon size="3" color="coolGray.600" />}
                />
              </HStack>
            </VStack>
          </Alert>
        ) : null}
      </Center>
    </NativeBaseProvider>
  );
};
