import { GeoPoint } from "@firebase/firestore";
import {
  Button,
  Center,
  FormControl,
  Input,
  NativeBaseProvider,
  Text,
  TextArea,
  Toast,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { createDelivery } from "../../../database/delivery";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { fetchDeliveries } from "../../../store/slices/delivery";
export const AddDeliveryScreen = ({ route, navigation }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("0.1");
  const [markerPosition, setMarkerPosition] = useState("");
  const dispatch = useDispatch();

  const save = async () => {
    if (
      nombre != "" &&
      descripcion != "" &&
      precio > 0 &&
      markerPosition != ""
    ) {
      const delivery = {
        nombre,
        descripcion,
        precio,
        location: new GeoPoint(
          markerPosition.latitude,
          markerPosition.longitude
        ),
        userId: getAuth().currentUser.uid,
        state: "available",
        createdAt: Date.now(),
      };
      await createDelivery(delivery);
      dispatch(fetchDeliveries({ statusFilter: route.params.statusFilter }));
      navigation.goBack();
    } else Toast.show({ description: "Lleno todos los campos correctamente" });
  };
  return (
    <NativeBaseProvider>
      <VStack w="100%" h="100%" bg="white" p={2}>
        <FormControl isRequired mb={4}>
          <FormControl.Label>Nombre</FormControl.Label>
          <Input
            placeholder="Nombre de la entrega"
            value={nombre}
            onChangeText={(e) => setNombre(e)}
          />
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormControl.Label>Descripción</FormControl.Label>
          <TextArea
            placeholder="Descripción de la entrega"
            h={20}
            value={descripcion}
            onChangeText={(e) => setDescripcion(e)}
          />
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormControl.Label>Precio</FormControl.Label>
          <Input
            placeholder="Precio"
            keyboardType="decimal-pad"
            value={precio}
            onChangeText={(e) => setPrecio(e)}
          />
        </FormControl>
        <Text>Seleccione la ubicación de entrega:</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 22.4122423,
            longitude: -83.6957372,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => setMarkerPosition(e.nativeEvent.coordinate)}
        >
          {markerPosition ? <Marker coordinate={markerPosition} /> : null}
        </MapView>
        <Button mt={4} size="lg" onPress={save}>
          Salvar
        </Button>
      </VStack>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 300,
  },
});
