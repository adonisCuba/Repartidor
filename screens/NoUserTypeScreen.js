import React from "react";
import { Button, Center, NativeBaseProvider, Text, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
export const NoUserTypeScreen = () => {
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
      <Center w="100%" h="100%" backgroundColor="cyan.100">
        <Text fontSize={16}>
          Debe pasar primeramente por el proceso de registro.
        </Text>
        <Text fontSize={16}>
          Por favor cierre la sesión y en la interfaz de entrada, dele click a
          "Registrarse".
        </Text>
        <Button
          mt={4}
          leftIcon={
            <Icon as={<Ionicons name="log-out" />} size="sm" color="white" />
          }
          onPress={logOut}
        >
          Cerrar sesión
        </Button>
      </Center>
    </NativeBaseProvider>
  );
};
