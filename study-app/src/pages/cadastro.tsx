import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Logo from '../assets/logo.png';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Text, View, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../services/firebaseConfig";

export default function Cadastro() {
    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); 
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const [createUserWithEmailAndPassword, firebaseUser, firebaseLoading, error
      ] = useCreateUserWithEmailAndPassword(auth);

    async function handleRegister() {
        preventDefault();
        createUserWithEmailAndPassword(email, password);
        navigation.reset({ routes: [{ name: 'LoginRoutes' }] });
        
        try {
            setLoading(true);
            if (!email || !password || !username) {
                return Alert.alert('Atenção!!', 'Informe os campos obrigatórios!');
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={style.container}>
            <View style={style.boxCenter}>
                <Input
                    title="NOME DE USUÁRIO"
                    value={username}
                    onChangeText={setUsername}
                    IconRigth={MaterialIcons}
                    iconRightName="person"
                />
                <Input
                    title="ENDEREÇO E-MAIL"
                    value={email}
                    onChangeText={setEmail}
                    IconRigth={MaterialIcons}
                    iconRightName="email"

                />
                <Input
                    title="SENHA"
                    value={password}
                    onChangeText={setPassword}
                    IconRigth={Octicons}
                    iconRightName={showPassword ? "eye-closed" : "eye"}
                    onIconRigthPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={showPassword}
                />
            </View>
            <View style={style.boxBottom}>
                <Button text="CADASTRAR" loading={loading} onPress={handleRegister} />
                <Text style={style.textBottom}>
                    Já tem conta? 
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={style.textBottomCreate}> Faça Login</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
}

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    boxCenter: {
        flex: 0.5,
        width: '100%',
        justifyContent: 'center',
    },
    boxBottom: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    textBottom: {
        fontSize: 16,
        color: 'gray',
        marginTop: 20,
    },
    textBottomCreate: {
        fontSize: 16,
        color: '#878af6',
    },
});

function preventDefault() {
    throw new Error("Function not implemented.");
}
