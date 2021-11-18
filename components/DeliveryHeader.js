import React from "react";
import {
  Text,
  Icon,
  NativeBaseProvider,
  StatusBar,
  IconButton,
  Box,
  HStack,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";

export const DeliveryHeader = (props) => {
  const logOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="#06b6d4" barStyle="light-content" />
      <Box safeAreaTop backgroundColor="#06b6d4" />
      <HStack
        bg="#06b6d4"
        w="100%"
        h="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack space="4" alignItems="center">
          <Text color="white" fontSize="20" fontWeight="bold">
            {props.title}
          </Text>
        </HStack>
        <HStack space="2">
          <IconButton
            icon={
              <Icon
                as={<Ionicons name="log-out" />}
                size="sm"
                color="white"
                onPress={logOut}
              />
            }
          />
        </HStack>
      </HStack>
    </NativeBaseProvider>
  );
};
