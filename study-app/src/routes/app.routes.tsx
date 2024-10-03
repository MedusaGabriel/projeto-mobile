import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProviderList } from '../context/authContext_list';
import React from 'react';
import { Image } from 'react-native';
import Hoje from '../pages/hoje';
import Metas from '../pages/metas';
import Materias from '../pages/materias';
import Mais from '../pages/mais';

const Tab = createBottomTabNavigator();

export default function AppRouter() {
  return (
    <AuthProviderList>
      <Tab.Navigator
        initialRouteName="Hoje"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Hoje') {
              iconName = require('../assets/icons/iconhoje.png');
            } else if (route.name === 'Metas') {
              iconName = require('../assets/icons/iconmetas.png');
            } else if (route.name === 'Materias') {
              iconName = require('../assets/icons/iconmaterias.png');
            } else if (route.name === 'Mais') {
              iconName = require('../assets/icons/iconmais.png');
            }

            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#353535',
          },
          headerTintColor: '#FFF',
        })}
      >
        <Tab.Screen name="Hoje" component={Hoje} />
        <Tab.Screen name="Metas" component={Metas} />
        <Tab.Screen name="Materias" component={Materias}
        options={{
          headerStyle: {
            backgroundColor: '#353535', 
          }, 
          headerTintColor: '#FFF',
        }}
          />
        <Tab.Screen name="Mais" component={Mais} />
      </Tab.Navigator>
      </AuthProviderList>
  );
}