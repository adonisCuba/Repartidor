import {
  NativeBaseProvider,
  Select,
  VStack,
  CheckIcon,
  ScrollView,
  Box,
  Fab,
  Icon,
  Divider,
} from "native-base";
import React, { useEffect, useState } from "react";
import { BusinessDeliveryItem } from "../../components/BusinessDeliveryItem";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveries } from "../../store/slices/delivery";

const config = {
  dependencies: {
    "linear-gradient": require("expo-linear-gradient").LinearGradient,
  },
};

export const HomeBusinessScreen = ({ navigation }) => {
  const [statusFilter, setStatusFilter] = useState("available");
  const deliveries = useSelector((state) => state.delivery.deliveries);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDeliveries({ statusFilter }));
  }, []);
  return (
    <NativeBaseProvider config={config}>
      <VStack alignItems="center" space={2} h="100%" bg="white">
        <Select
          w="95%"
          m={2}
          selectedValue={statusFilter}
          accessibilityLabel="Seleccione el estado"
          placeholder="Seleccione el estado"
          _selectedItem={{
            bg: "primary.400",
            endIcon: <CheckIcon size="5" />,
          }}
          onValueChange={(value) =>
            setStatusFilter(
              value,
              dispatch(fetchDeliveries({ statusFilter: value }))
            )
          }
        >
          <Select.Item label="Disponible" value="available" />
          <Select.Item label="Tomada" value="taked" />
          <Select.Item label="Entregada" value="delivered" />
        </Select>
        <Divider />
        <ScrollView w="95%">
          {deliveries.map((delivery, index) => (
            <BusinessDeliveryItem
              delivery={delivery}
              key={index}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </VStack>
      <Box position="relative" h={100} w="100%">
        <Fab
          position="absolute"
          size="sm"
          icon={<Icon color="white" as={<Ionicons name="add" />} size="sm" />}
          onPress={() => {
            navigation.navigate("AddDelivery", { statusFilter });
          }}
        />
      </Box>
    </NativeBaseProvider>
  );
};
