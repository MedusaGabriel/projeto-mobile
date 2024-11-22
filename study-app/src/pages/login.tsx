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

export default function Login() {
    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [signInWithEmailAndPassword, firebaseUser, firebaseloading, error] =
        useSignInWithEmailAndPassword(auth);

    //Função para realizar o login
    async function getLogin() {
        setLoading(true);
        if (!email || !password) {
            setLoading(false);
            return Alert.alert('Atenção!!', 'Informe os campos obrigatórios!')
        }
        const userCredential = await signInWithEmailAndPassword(email, password);
        if (userCredential) {
            console.log('Login realizado com sucesso');
            navigation.reset({ routes: [{ name: 'AppRouter' }] });
        }
    }

    //Monitora se há algum erro e retorna no console e no Alerta
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
                    title="ENDEREÇO E-MAIL"
                    value={email}
                    onChangeText={setEmail}
                    IconRigth={MaterialIcons}
                    iconRightName="email"
                    style={styles.input} // Estilo para o campo de email
                />
                <Input
                    title="SENHA"
                    value={password}
                    onChangeText={setPassword}
                    IconRigth={Octicons}
                    iconRightName={showPassword ? "eye-closed" : "eye"}
                    onIconRigthPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={showPassword}
                    style={styles.input} // Estilo para o campo de senha
                />
            </View>
            <View style={styles.boxBottom}>
                <Button text="ENTRAR" loading={loading} onPress={() => getLogin()} />
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
        backgroundColor: '#2D2D2D', // Fundo cinza escuro (preto mais claro)
    },
    boxTop: {
        height: Dimensions.get('window').height / 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxMid: {
        height: Dimensions.get('window').height / 4,
        width: '100%',
        paddingHorizontal: 37,
    },
    boxBottom: {
        height: Dimensions.get('window').height / 3,
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
        backgroundColor: '#fff', // Cor de fundo dos campos
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000', // Sombras para dar profundidade
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5, // Elevação para Android
    },
    textBottom: {
        position: "absolute",
        bottom: 50,
        fontSize: 16,
        color: 'gray',
    },
    textBottomCreate: {
        fontSize: 16,
        color: '#878af6', // Cor para o link "Crie agora"
    },
});
