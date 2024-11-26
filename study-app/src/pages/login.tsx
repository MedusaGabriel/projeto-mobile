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
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Fazer login</Text>
            </View>
            <View style={styles.boxCenter}>
                <Input
                placeholder="Email"
                height={55}
                IconRigth={MaterialIcons}
                iconRightName="email"
                placeholderTextColor={themas.Colors.secondary}
                value={email}
                onChangeText={setEmail}
            />
                <Input
                placeholder="Senha"
                placeholderTextColor={themas.Colors.secondary}
                value={password}
                height={55}
                IconRigth={Octicons}
                onChangeText={setPassword}
                iconRightName={showPassword ? "eye-closed" : "eye"}
                onIconRigthPress={() => setShowPassword(!showPassword)}
                secureTextEntry={showPassword}
                style={{ backgroundColor: themas.Colors.bgScreen }}
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
    boxCenter: {
        flex: 0.5,
        width: '90%',
        justifyContent: 'center',
        marginBottom: 50,
    },
    boxTop: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
    },
    boxBottom: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    logo: {
        width: 180,
        height: 180,
        marginTop: 0,
        marginBottom: 75,

    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: -40,
        
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

