import React, { useState, useEffect } from "react";
import {
  confirmDelivery,
  getDelivery,
  releaseDelivery,
  takeDelivery,
} from "../../../database/delivery";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { fetchBoyDeliveries } from "../../../store/slices/delivery";
import MapView, { Marker } from "react-native-maps";
import { Alert, Platform, StyleSheet, TouchableOpacity } from "react-native";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Image,
  Input,
  NativeBaseProvider,
  Text,
  TextArea,
  VStack,
  useToast,
} from "native-base";
import ImageView from "react-native-image-viewing";
import { Video } from "expo-av";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
export const DeliveryDetailsScreen = ({ route, navigation }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("0.1");
  const [markerPosition, setMarkerPosition] = useState("");
  const [estado, setEstado] = useState("");
  const [isImageVisible, setIsImageVisible] = useState(false);
  const { deliveryId } = route.params;
  const { imageUrl } = route.params;
  const { videoUrl } = route.params;
  const dispatch = useDispatch();
  useEffect(() => {
    let mounted = true;
    getDelivery(deliveryId).then((item) => {
      if (mounted) {
        setNombre(item.nombre);
        setDescripcion(item.descripcion);
        setPrecio(item.precio);
        setMarkerPosition(item.location);
        setEstado(item.state);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);
  const onTomarEntrega = async () => {
    await takeDelivery(deliveryId, getAuth().currentUser.uid);
    dispatch(fetchBoyDeliveries());
    navigation.goBack();
  };
  const onLiberarEntrega = async () => {
    Alert.alert("Alerta", "Está seguro de liberar la entrega?", [
      {
        text: "Aceptar",
        onPress: async () => {
          await releaseDelivery(deliveryId);
          dispatch(fetchBoyDeliveries());
          navigation.goBack();
        },
      },
      {
        text: "Cancelar",
      },
    ]);
  };

  const toast = useToast();
  const onConfirmarEntrega = async () => {
    if (videoUrl || imageUrl) {
      await confirmDelivery(deliveryId, imageUrl, videoUrl);
      dispatch(fetchBoyDeliveries());
      sendNotification();
      navigation.goBack();
    } else
      toast.show({
        description: "Debe tomar prueba de la entrega antes de confirmarla.",
      });
  };
  const onFotoEntrega = () =>
    navigation.navigate("TomarFotoEntrega", { deliveryId });
  const onVideoEntrega = () =>
    navigation.navigate("TomarVideoEntrega", { deliveryId });

  const sendNotification = async () => {
    if (Platform.OS) {
      const expoPushToken = await SecureStore.getItemAsync("expoPushToken");
      const message = {
        to: expoPushToken,
        title: "Entrega concluida",
        body: `La entrega ${nombre} fue completada.`,
      };
      axios.post("https://exp.host/--/api/v2/push/send", message);
    }
  };

  return (
    <NativeBaseProvider>
      {imageUrl ? (
        <HStack bg="white" p={2}>
          <TouchableOpacity onPress={() => setIsImageVisible(true)}>
            <Image
              source={{
                uri: imageUrl,
              }}
              alt="Foto de la entrega"
              size="md"
            />
          </TouchableOpacity>

          <ImageView
            images={[
              {
                uri: imageUrl,
              },
            ]}
            imageIndex={0}
            visible={isImageVisible}
            onRequestClose={() => setIsImageVisible(false)}
          />
          <Text ml={5}>Imagen de la entrega</Text>
        </HStack>
      ) : null}
      {videoUrl ? (
        <Video
          source={{ uri: videoUrl }}
          useNativeControls
          resizeMode="contain"
          style={{ height: 250, backgroundColor: "white" }}
        />
      ) : null}

      <VStack w="100%" h="100%" bg="white" p={2}>
        {estado == "taked" && !videoUrl && !imageUrl ? (
          <>
            <Button mt={2} colorScheme="danger" onPress={onFotoEntrega}>
              Tomar foto de entrega
            </Button>
            <Button mt={2} onPress={onVideoEntrega}>
              Tomar video de entrega
            </Button>
          </>
        ) : null}
        <FormControl isRequired mb={3}>
          <FormControl.Label>Nombre</FormControl.Label>
          <Input
            placeholder="Nombre de la entrega"
            value={nombre}
            isDisabled={true}
          />
        </FormControl>
        {!videoUrl ? (
          <>
            <FormControl isRequired mb={3}>
              <FormControl.Label>Descripción</FormControl.Label>
              <TextArea
                placeholder="Descripción de la entrega"
                h={20}
                value={descripcion}
                isDisabled={true}
              />
            </FormControl>
            <FormControl isRequired mb={3}>
              <FormControl.Label>Precio</FormControl.Label>
              <Input
                placeholder="Precio"
                keyboardType="decimal-pad"
                value={precio}
                isDisabled={true}
              />
            </FormControl>
          </>
        ) : null}

        <Text>Ubicación de entrega:</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 22.4122423,
            longitude: -83.6957372,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {markerPosition ? (
            <Marker
              coordinate={{
                latitude: markerPosition.latitude,
                longitude: markerPosition.longitude,
              }}
            />
          ) : null}
        </MapView>
        {estado == "available" ? (
          <>
            <Button mt={4} size="lg" onPress={onTomarEntrega}>
              Tomar entrega
            </Button>
          </>
        ) : estado == "taked" ? (
          <>
            <Button mt={4} colorScheme="danger" onPress={onLiberarEntrega}>
              Liberar entrega
            </Button>
            <Button mt={4} onPress={onConfirmarEntrega}>
              Confirmar entrega
            </Button>
          </>
        ) : null}
      </VStack>
    </NativeBaseProvider>
  );
};
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 150,
  },
});
