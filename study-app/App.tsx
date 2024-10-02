import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Hoje from './src/pages/hoje';
import Metas from './src/pages/metas';
import Materias from './src/pages/materias';
import Mais from './src/pages/mais';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Hoje"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Hoje') {
              iconName = require('./src/assets/icons/iconhoje.png');
            } else if (route.name === 'Metas') {
              iconName = require('./src/assets/icons/iconmetas.png');
            } else if (route.name === 'Materias') {
              iconName = require('./src/assets/icons/iconmaterias.png');
            } else if (route.name === 'Mais') {
              iconName = require('./src/assets/icons/iconmais.png');
            }

            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Hoje" component={Hoje} />
        <Tab.Screen name="Metas" component={Metas} />
        <Tab.Screen name="Materias" component={Materias} />
        <Tab.Screen name="Mais" component={Mais} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
