import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';
import Home from '../pages/home';
import Metas from '../pages/metas';
import Materias from '../pages/materias';
import Mais from '../pages/mais';
import { themas } from '../global/themes';

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
        tabBarActiveTintColor: themas.Colors.blueLigth,
        tabBarInactiveTintColor: themas.Colors.secondary,
        tabBarStyle: {  
          paddingTop: 10,
          paddingBottom: 40, // Aumenta o espaço abaixo
          backgroundColor: themas.Colors.bgSecondary,
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
          borderTopWidth: 0, // Remove borda superior
          height: 80, // Aumenta a altura da barra para garantir que ela tenha mais espaço
        },
        headerShown: false,
        headerTintColor: themas.Colors.secondary,
        tabBarLabelStyle: {
          fontFamily: themas.Fonts.semiBold,
          fontSize: 13,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Metas" component={Metas} />
      <Tab.Screen name="Matérias" component={Materias} />
      <Tab.Screen name="Preferências" component={Mais} />
    </Tab.Navigator>
  );
}