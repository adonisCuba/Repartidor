import { Box, Divider, FlatList, Input, Text, VStack, Icon } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export const AutoComplete = (props) => {
  return (
    <VStack>
      <Input
        {...props}
        InputRightElement={
          <Icon
            as={<Ionicons name="search" />}
            size={5}
            mr="2"
            color="muted.400"
          />
        }
      />
      <Box w="100%" backgroundColor="white" borderStyle="solid" zIndex={2}>
        {props.data.length > 0 ? (
          <FlatList
            maxH={100}
            data={props.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: 2 }}
                onPress={() => {
                  props.onSelectedItem(item.id);
                }}
              >
                <Text>{item.nombre}</Text>
                <Divider />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </Box>
    </VStack>
  );
};
