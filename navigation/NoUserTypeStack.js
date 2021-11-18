import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NoUserTypeScreen } from "../screens/NoUserTypeScreen";
const Stack = createStackNavigator();
export default function NoUserTypeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NoUserType" component={NoUserTypeScreen} />
    </Stack.Navigator>
  );
}
