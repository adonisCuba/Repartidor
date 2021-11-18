import {
  NativeBaseProvider,
  Center,
  Stack,
  Heading,
  Button,
} from "native-base";
import React from "react";
export const ChooseScreen = ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" bg="white">
        <Stack space={4} w="100%" alignItems="center">
          <Heading textAlign="center" mb="10">
            Escoger perfil de usuario
          </Heading>
        </Stack>
        <Button
          m={5}
          w="75%"
          onPress={() =>
            navigation.navigate("Signup", { typeUser: "business" })
          }
        >
          Negocio
        </Button>
        <Button
          w="75%"
          onPress={() =>
            navigation.navigate("Signup", { typeUser: "delivery boy" })
          }
        >
          Mensajero
        </Button>
      </Center>
    </NativeBaseProvider>
  );
};
