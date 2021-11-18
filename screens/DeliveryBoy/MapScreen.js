import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import {
  NativeBaseProvider,
  Text,
  VStack,
  Box,
  HStack,
  Image,
  Typeahead,
  Icon,
  ScrollView,
  Divider,
  Input,
} from "native-base";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoyDeliveries } from "../../store/slices/delivery";
import { AutoComplete } from "../../components/AutoComplete";

export const MapScreen = ({ navigation }) => {
  const deliveries = useSelector((state) => state.delivery.deliveries);
  const [searchText, setSearchText] = useState("");
  const [filterDeliveries, setFilterDeliveries] = useState([]);
  const mapRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBoyDeliveries());
  }, []);
  const filter = (query = "NULL") => {
    setSearchText(query);
    if (query.length > 2) {
      const filter = deliveries.filter(
        (item) =>
          item.nombre.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
          item.descripcion.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
      setFilterDeliveries(filter);
    } else setFilterDeliveries([]);
  };
  const onSelectSearch = (id) => {
    const delivery = deliveries.find((item) => item.id == id);
    setSearchText(delivery.nombre);
    setFilterDeliveries([]);
    mapRef.current.animateCamera(
      {
        center: {
          latitude: delivery.location.latitude,
          longitude: delivery.location.longitude,
        },
        zoom: 17,
      },
      { duration: 1500 }
    );
  };
  const onPressMarker = (deliveryId) => {
    Alert.alert("Información", "Desea ver detalles de la enterga?", [
      {
        text: "Aceptar",
        onPress: () => {
          navigation.navigate("BoyDelivery", { deliveryId });
        },
      },
      {
        text: "Cancelar",
      },
    ]);
  };
  return (
    <NativeBaseProvider>
      <VStack w="100%" h="100%" bg="white">
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 22.4122423,
            longitude: -83.6957372,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zIndex={1}
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
                    onPress={() => {
                      onPressMarker(delivery.id);
                    }}
                  />
                );
              })
            : null}
        </MapView>
        <Box style={styles.autocompleteContainer}>
          <AutoComplete
            data={filterDeliveries}
            onChangeText={filter}
            onSelectedItem={onSelectSearch}
            value={searchText}
          />
        </Box>
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
    height: "70%",
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
    margin: 6,
    backgroundColor: "white",
    borderRadius: 5,
  },
  listStyle: {
    width: "100%",
  },
});
