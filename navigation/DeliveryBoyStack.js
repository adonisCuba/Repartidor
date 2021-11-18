import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MapScreen } from "../screens/DeliveryBoy/MapScreen";
import { Ionicons } from "@expo/vector-icons";
import { DeliveryHeader } from "../components/DeliveryHeader";
import { DeliveryDetailsScreen } from "../screens/DeliveryBoy/Delivery/DeliveryDetailsScreen";
import { TakePhotoScreen } from "../screens/DeliveryBoy/Delivery/TakePhotoScreen";
import { TakeVideoScreen } from "../screens/DeliveryBoy/Delivery/TakeVideoScreen";

const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#06b6d4",
        tabBarInactiveTintColor: "#737373",
      }}
    >
      <Tab.Screen
        name="DeliveryMap"
        component={MapScreen}
        options={{
          tabBarLabel: "Mapa",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Delivery"
        component={DeliveryScreen}
        options={{
          tabBarLabel: "Entregas",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function DeliveryBoyStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="DeliveryBoy"
          component={HomeTab}
          options={{
            headerTitle: (props) => (
              <DeliveryHeader title="Mis entregas" {...props} />
            ),
            headerStyle: {
              backgroundColor: "#06b6d4",
            },
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="BoyDelivery"
          component={DeliveryDetailsScreen}
          options={{ title: "Detalles de la entrega" }}
        />
        <Stack.Screen
          name="TomarFotoEntrega"
          component={TakePhotoScreen}
          options={{ title: "Foto de la entrega" }}
        />
        <Stack.Screen
          name="TomarVideoEntrega"
          component={TakeVideoScreen}
          options={{ title: "Video de la entrega" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
