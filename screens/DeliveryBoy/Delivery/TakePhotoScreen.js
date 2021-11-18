import { Camera } from "expo-camera";
import {
  Box,
  Button,
  Spinner,
  HStack,
  Icon,
  NativeBaseProvider,
  VStack,
  Heading,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
export const TakePhotoScreen = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [uploading, setUploading] = useState(false);
  const camera = useRef();
  const { deliveryId } = route.params;
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <Box>
        <Text>No tiene acceso a la cámara</Text>
      </Box>
    );
  }
  const takePicture = async () => {
    if (camera) {
      let photo = await camera.current.takePictureAsync({ quality: 0.5 });
      setUploading(true);

      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const storage = getStorage();
      const refStorage = ref(
        storage,
        `images/${getAuth().currentUser.uid}/${deliveryId}.jpg`
      );
      await uploadBytes(refStorage, blob);
      setUploading(false);
      const imageUrl = await getDownloadURL(refStorage);
      navigation.navigate({
        name: "BoyDelivery",
        params: { imageUrl },
        merge: true,
      });
    }
  };
  return (
    <NativeBaseProvider>
      <VStack bg="white" h="100%">
        <View style={styles.container}>
          <Camera ref={camera} style={styles.camera} type={type}></Camera>
        </View>
        <HStack space={3} alignItems="center" justifyContent="center" mt={2}>
          <Button
            leftIcon={
              <Icon as={<MaterialIcons name="autorenew" />} size="sm" />
            }
            size="sm"
            h={10}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            Voltear
          </Button>
          <Button
            leftIcon={<Icon as={<MaterialIcons name="camera" />} size="sm" />}
            size="sm"
            h={10}
            onPress={takePicture}
          >
            Tomar foto
          </Button>
        </HStack>
        {uploading ? (
          <HStack space={2} alignItems="center" justifyContent="center" mt={3}>
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Subiendo imagen
            </Heading>
          </HStack>
        ) : null}
      </VStack>
    </NativeBaseProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    aspectRatio: 3 / 4,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    margin: 20,
  },
  button: {
    flex: 0.2,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
