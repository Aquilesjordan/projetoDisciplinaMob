import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import BooksScreen from './screens/BooksScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function SairTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Books" component={BooksScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Sair" component={SairTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
