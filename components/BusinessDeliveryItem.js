import React from "react";
import { Text, HStack, VStack, Link } from "native-base";

export const BusinessDeliveryItem = (props) => {
  return (
    <VStack
      rounded="8"
      w="96%"
      m={2}
      p={2}
      bg={{
        linearGradient: {
          colors: ["primary.500", "primary.600"],
          start: [0, 0],
          end: [0, 1],
        },
      }}
    >
      <Text fontSize="md" bold color="white">
        {props.delivery.nombre}
      </Text>
      <Text color="white">{props.delivery.descripcion}</Text>
      <HStack justifyContent="space-between" mt={1}>
        <Text color="white">
          Creada: {new Date(props.delivery.createdAt).toLocaleDateString()}
        </Text>
        <Link
          _text={{
            color: "white",
          }}
          onPress={() =>
            props.navigation.navigate("EditDelivery", {
              itemId: props.delivery.id,
            })
          }
        >
          Ver más
        </Link>
      </HStack>
    </VStack>
  );
};
