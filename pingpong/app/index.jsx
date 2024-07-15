import React from "react";
import { PaperProvider } from "react-native-paper";
import { StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
import Chat from './chat';

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <PaperProvider>
      {/* // <NavigationContainer> */}
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      {/* </NavigationContainer> */}
   </PaperProvider>
  );
}

