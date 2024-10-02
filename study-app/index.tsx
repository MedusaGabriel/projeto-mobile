// src/index.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import hoje from './pages/hoje';
import metas from './pages/metas';
import materias from './pages/materias';
import mais from './pages/mais';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Hoje"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Hoje') {
              iconName = require('./assets/icons/iconhoje.png');
            } else if (route.name === 'Metas') {
              iconName = require('./assets/icons/iconmetas.png');
            } else if (route.name === 'Materias') {
              iconName = require('./assets/icons/iconmaterias.png');
            } else if (route.name === 'Mais') {
              iconName = require('./assets/icons/iconmais.png');
            }

            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Hoje" component={hoje} />
        <Tab.Screen name="Metas" component={metas} />
        <Tab.Screen name="Materias" component={materias} />
        <Tab.Screen name="Mais" component={mais} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
