import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Alert, View, Text, Image, KeyboardAvoidingView, Platform } from "react-native";
import Loginicon from '../assets/login.png';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                <View style={styles.boxTop}>
                    <Image source={Loginicon} style={styles.logo} resizeMode="contain" />
                </View>
                <View style={styles.boxCenter}>
                    <View style={styles.tittlelogin}>
                        <Text style={styles.title}>Bem-vindo,</Text>
                        <Text style={styles.title}>Pronto para a jornada?</Text>
                    </View>
                    <Input
                        boxStyle={{
                            marginTop: -4,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        placeholder="Email"
                        height={55}
                        IconRight={MaterialIcons}
                        iconRightName="email"
                        placeholderTextColor={themas.Colors.secondary}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Input
                        boxStyle={{
                            marginTop: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}
                        placeholder="Senha"
                        placeholderTextColor={themas.Colors.secondary}
                        value={password}
                        height={55}
                        IconRight={Octicons}
                        onChangeText={setPassword}
                        iconRightName={showPassword ? "eye-closed" : "eye"}
                        onIconRightPress={() => setShowPassword(!showPassword)}
                        secureTextEntry={showPassword}
                        style={{ backgroundColor: themas.Colors.bgScreen }}
                    />
                </View>
                <View style={styles.boxBottom}>
                    <Button
                        text="Entrar"
                        loading={loading}
                        onPress={() => getLogin()}
                        textStyle={{ fontSize: 18, fontFamily: themas.Fonts.medium }}
                        backgroundColor={{ backgroundColor: themas.Colors.blueLigth }}
                        width="100%"
                    />
                </View>
                <Text style={styles.textBottom}>
                    Não tem conta?
                    <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={styles.textBottomCreate}> Crie agora</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: themas.Colors.bgSecondary,
    },
    boxTop: {
        marginTop: 90,
        width: '85%',
        height: "auto",
        alignItems: 'center',
        marginBottom: 25,
    },
    boxCenter: {
        width: '85%',
        justifyContent: 'center',
    },
    boxBottom: {
        width: '85%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 20,
    },
    logo: { 
        width: 300,
        height: 250,
    },
    tittlelogin: {
        marginBottom: 30,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'left',
        fontSize: 24,
        color: themas.Colors.primary,
        fontFamily: themas.Fonts.extraBold,
        fontWeight: 'bold',
    },
    textBottom: {
        position: 'absolute',
        bottom: 40,
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