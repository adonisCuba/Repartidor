import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeBusinessScreen } from "../screens/Business/HomeBusinessScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MapBusinessScreen } from "../screens/Business/MapBusinessScreen";
import { BussinessHeader } from "../components/BusinessHeader";
import { Ionicons } from "@expo/vector-icons";
import { AddDeliveryScreen } from "../screens/Business/Delivery/AddDeliveryScreen";
import { EditDeliveryScreen } from "../screens/Business/Delivery/EditDeliveryScreen";

const Tab = createBottomTabNavigator();

function HomeBusiness() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#06b6d4",
        tabBarInactiveTintColor: "#737373",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeBusinessScreen}
        options={{
          tabBarLabel: "Inicio",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapBusinessScreen}
        options={{
          tabBarLabel: "Mapa",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function BusinessStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Business"
          options={{
            headerTitle: (props) => (
              <BussinessHeader title="Mi negocio" {...props} />
            ),
            headerStyle: {
              backgroundColor: "#06b6d4",
            },
          }}
          component={HomeBusiness}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="AddDelivery"
          component={AddDeliveryScreen}
          options={{ title: "Adicionar reparto" }}
        />
        <Stack.Screen
          name="EditDelivery"
          component={EditDeliveryScreen}
          options={{ title: "Vista de reparto" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
