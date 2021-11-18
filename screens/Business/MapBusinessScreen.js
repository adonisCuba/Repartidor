import {
  Box,
  HStack,
  Image,
  NativeBaseProvider,
  Text,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveries } from "../../store/slices/delivery";

export const MapBusinessScreen = ({ navigation }) => {
  const deliveries = useSelector((state) => state.delivery.deliveries);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDeliveries({ statusFilter: "all" }));
  }, []);
  return (
    <NativeBaseProvider>
      <VStack w="100%" h="100%" bg="white">
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 22.4122423,
            longitude: -83.6957372,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {deliveries.length > 0
            ? deliveries.map((delivery, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: delivery.location.latitude,
                      longitude: delivery.location.longitude,
                    }}
                    title={delivery.nombre}
                    description={delivery.descripcion}
                    image={
                      delivery.state == "available"
                        ? require("../../assets/pins/pin_red.png")
                        : delivery.state == "taked"
                        ? require("../../assets/pins/pin_blue.png")
                        : require("../../assets/pins/pin_green.png")
                    }
                  />
                );
              })
            : null}
        </MapView>
        <Box p={3}>
          <VStack>
            <Text>Leyenda:</Text>
            <HStack p={1} alignItems="center">
              <Image
                source={require("../../assets/pins/pin_red.png")}
                size="2xs"
                alt="Disponible "
              />
              <Text>Disponible</Text>
            </HStack>
            <HStack p={1} alignItems="center">
              <Image
                source={require("../../assets/pins/pin_blue.png")}
                size="2xs"
                alt="Tomada"
              />
              <Text>Tomada</Text>
            </HStack>
            <HStack p={1} alignItems="center">
              <Image
                source={require("../../assets/pins/pin_green.png")}
                size="2xs"
                alt="Entregada"
              />
              <Text>Entregada</Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "75%",
  },
});
