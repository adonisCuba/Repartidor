import React from "react";
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
import { getAuth } from "firebase/auth";
import {
  FacebookAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import * as Facebook from "expo-facebook";
import Constants from "expo-constants";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [rightIcon, setRightIcon] = useState("eye-off");
  const [loginError, setLoginError] = useState("");

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const onLogin = async () => {
    try {
      if (email !== "" && password !== "") {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const onLoginFacebook = async () => {
    try {
      const appId = Constants.manifest.extra.facebookAppId;
      await Facebook.initializeAsync({ appId });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      if (type === "success") {
        const auth = getAuth();
        const credential = FacebookAuthProvider.credential(token);
        await signInWithCredential(auth, credential);
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" bg="white">
        <Stack space={4} w="100%" alignItems="center">
          <Heading textAlign="center" mb="10">
            Entrar
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
              leftIcon={<Icon as={<Ionicons name="log-in" />} />}
              onPress={onLogin}
            >
              Entrar
            </Button>
            <Button
              ml={2}
              variant="subtle"
              leftIcon={<Icon as={<Ionicons name="checkmark" />} />}
              onPress={() => navigation.navigate("Choose")}
            >
              Registrarse
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
              onPress={onLoginFacebook}
            >
              Facebook
            </Button>
          </HStack>
        </Stack>
        {loginError ? (
          <Alert status="error" mt={5}>
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    {loginError}
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
