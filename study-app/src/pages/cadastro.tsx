import React, { useState } from "react";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
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
    const [user, setUser] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [createUserWithEmailAndPassword, user, loading, error,
      ] = useCreateUserWithEmailAndPassword(auth);

    async function handleRegister(e) {
        e.preventDefault();
        createUserWithEmailAndPassword(email, password);
        try {
            setLoading(true);
            if (!email || !password || !confirmPassword || !user) {
                return Alert.alert('Atenção!!', 'Informe os campos obrigatórios!');
            }
            if (password !== confirmPassword) {
                return Alert.alert('Atenção!!', 'As senhas não coincidem!');
            }

            // Lógica de registro aqui

            navigation.reset({ routes: [{ name: 'LoginRoutes' }] });
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
                    value={user}
                    onChangeText={e.setUser(e.target.value)}
                    IconRigth={MaterialIcons}
                    iconRightName="person"
                />
                <Input
                    title="ENDEREÇO E-MAIL"
                    value={email}
                    onChangeText={e.setEmail(e.target.value)}
                    IconRigth={MaterialIcons}
                    iconRightName="email"

                />
                <Input
                    title="SENHA"
                    value={password}
                    onChangeText={e.setPassword(e.target.value)}
                    IconRigth={Octicons}
                    iconRightName={showPassword ? "eye-closed" : "eye"}
                    onIconRigthPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={showPassword}
                />
            </View>
            <View style={style.boxBottom}>
                <Button text="CADASTRAR" loading={loading} onPress={() => handleRegister()} />
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