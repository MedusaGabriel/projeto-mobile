import React from 'react';
import {createStackNavigator}from '@react-navigation/stack';
import Login from '../pages/login';
import Curso from '../pages/curso';
import Adcmaterias from '../pages/adcmaterias';
import AppRouter from './app.routes';

export default function Routes (){
    const Stack = createStackNavigator();  
    return(
        <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
                headerShown:false,
                cardStyle:{
                    backgroundColor:'#FFF'
                }
            }}
        >
            <Stack.Screen
                name="Login" 
                component={Login}
            />
            <Stack.Screen   
                name="LoginRoutes"
                component={Curso}
            />
            <Stack.Screen   
                name="Adcmaterias"
                component={Adcmaterias}
            />
            <Stack.Screen   
                name="AppRouter"
                component={AppRouter}
            />
        </Stack.Navigator>
  );
}