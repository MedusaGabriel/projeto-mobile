import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';
import Home from '../pages/home';
import Metas from '../pages/metas';
import Materias from '../pages/materias';
import Mais from '../pages/mais';

const Tab = createBottomTabNavigator();

export default function AppRouter() {
  return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = require('../assets/icons/iconhome.png');
            } else if (route.name === 'Metas') {
              iconName = require('../assets/icons/iconmetas.png');
            } else if (route.name === 'Matérias') {
              iconName = require('../assets/icons/iconmaterias.png');
            } else if (route.name === 'Preferências') {
              iconName = require('../assets/icons/iconmais.png');
            }

            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingTop: 10,
            backgroundColor: '#FFF',
          },
          headerTintColor: '#FFF',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Metas" component={Metas} />
        <Tab.Screen name="Matérias" component={Materias}/>
        <Tab.Screen name="Preferências" component={Mais} />
      </Tab.Navigator>
  );
}