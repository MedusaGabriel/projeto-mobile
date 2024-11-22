import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import Logo from '../assets/logo.png';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Text, View, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { auth } from "../services/firebaseConfig";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { themas } from '../global/themes'; 

export default function Login() {
    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [signInWithEmailAndPassword, firebaseUser, firebaseloading, error] =
        useSignInWithEmailAndPassword(auth);

    async function getLogin() {
        setLoading(true);
        if (!email || !password) {
            setLoading(false);
            return Alert.alert('Atenção!!', 'Informe os campos obrigatórios!');
        }
        const userCredential = await signInWithEmailAndPassword(email, password);
        if (userCredential) {
            console.log('Login realizado com sucesso');
            navigation.reset({ routes: [{ name: 'AppRouter' }] });
        }
    }

    useEffect(() => {
        if (error) {
            console.log('Erro ao tentar realizar login', error);
            Alert.alert('Erro', 'Falha no login, verifique suas credenciais.');
            setEmail('');
            setPassword('');
            setLoading(false);
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <View style={styles.boxTop}>
                <Image
                    source={Logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.boxMid}>
                <Input
                placeholder="Email"
                placeholderTextColor={themas.Colors.secondary}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
                <Input
                placeholder="Senha"
                placeholderTextColor={themas.Colors.secondary}
                value={password}
                onChangeText={setPassword}
                IconRigth={password.length > 0 ? Octicons : undefined}
                iconRightName={showPassword ? "eye-closed" : "eye"}
                onIconRigthPress={() => setShowPassword(!showPassword)}
                secureTextEntry={showPassword}
                style={[styles.input, { paddingRight: 50 }]}  // Aumenta o paddingRight para acomodar o ícone
            />
            </View>
            <View style={styles.boxBottom}>
                <Button text="Entrar" loading={loading} onPress={() => getLogin()} />
            </View>
            <Text style={styles.textBottom}>
                Não tem conta?
                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.textBottomCreate}> Crie agora</Text>
                </TouchableOpacity>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themas.Colors.bgSecondary,
    },
    boxTop: {
        height: Dimensions.get('window').height / 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxMid: {
        height: Dimensions.get('window').height / 6,  // Aumenta a altura da caixa central
        width: '100%',
        paddingHorizontal: 37,
    },
    boxBottom: {
        height: Dimensions.get('window').height / 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    logo: {
        width: 180,
        height: 180,
        marginTop: 40,
    },
    input: {
        paddingLeft: 10,  // Aumenta o paddingLeft para mover o texto para a esquerda
        paddingRight: 50, // Espaço fixo para o ícone de olho
        paddingVertical: 20,
        height: 60,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: themas.Colors.primary,
        fontFamily: themas.Fonts.regular,
    },    
    textBottom: {
        position: "absolute",
        bottom: 50,
        fontSize: 16,
        color: themas.Colors.secondary,
        fontFamily: themas.Fonts.regular,
        flexDirection: 'row',
        alignItems: 'center',
    },   
    textBottomCreate: {
        fontSize: 16,
        bottom: -5,
        color: themas.Colors.blueLigth,
        fontFamily: themas.Fonts.regular,
        marginLeft: 3,
    },
});

