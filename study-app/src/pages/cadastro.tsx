import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Text, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../services/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { themas } from "../global/themes";
import  cadastroIcon  from '../assets/cadastro.png';

export default function Cadastro() {
    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [createUserWithEmailAndPassword, firebaseUser, firebaseLoading, error] =
        useCreateUserWithEmailAndPassword(auth);

    // Verifica se o usuário foi criado com sucesso ou se houve um erro
    useEffect(() => {
        if (firebaseUser) {
            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            console.log('Conta criada com sucesso!!');
            salvarUsuarioNoFirestore(firebaseUser.user.uid, username, email, password);
            navigation.reset({ routes: [{ name: 'LoginRoutes' }] });
        }
    }, [firebaseUser, navigation]);

    // Função para salvar usuário no Firestore
    const salvarUsuarioNoFirestore = async (uid: string, username: string, email: string, password: string) => {
        try {
            await setDoc(doc(firestore, 'users', uid), {
                username: username,
                email: email,
                senha: password,
                criação: new Date().toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) // Adiciona a data de criação formatada
            });
            console.log("Usuário salvo com sucesso no Firestore!");
        } catch (error) {
            console.error("Erro ao salvar o usuário no Firestore: ", error);
            Alert.alert("Erro", "Ocorreu um erro ao salvar as informações do usuário.");
        }
    };

    // Verifica se houve erro
    useEffect(() => {
        if (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Erro', 'Este e-mail já está em uso. Tente outro.');
            } else {
                Alert.alert('Erro', 'Houve um problema ao criar sua conta. Tente novamente.');
            }
        }
    }, [error]);

    // Função para registrar o usuário
    async function handleRegister() {
        if (!email || !password || !username) {
            return Alert.alert('Atenção!!', 'Informe os campos obrigatórios!');
        }

        setLoading(true);
        // Cria o usuário com o email e senha
        await createUserWithEmailAndPassword(email, password);
        setLoading(false);
    }

    useEffect(() => {
        const keyboardDidShow = () => setKeyboardVisible(true);
        const keyboardDidHide = () => setKeyboardVisible(false);
    
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", keyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", keyboardDidHide);
    
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                {!isKeyboardVisible && (
                    <View style={styles.boxTop}>
                        <Image source={cadastroIcon} style={styles.logo} resizeMode="contain" />
                    </View>
                )}
                    <View style={[styles.boxCenter, isKeyboardVisible && { marginTop: +120 }]}>
                        <View style={styles.tittlecadastro}>
                            <Text style={styles.title}>É novo aqui?</Text>
                            <Text style={styles.title}>Faça seu cadastro!!</Text>
                        </View>
                        <Input
                            placeholder="Nome de usuário"
                            boxStyle={{
                                marginTop: -4,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            placeholderTextColor={themas.Colors.secondary}
                            value={username}
                            height={55}
                            onChangeText={setUsername}
                            IconRight={MaterialIcons}
                            iconRightName="person"
                            style={{ backgroundColor: themas.Colors.bgScreen }}
                        />
                        <Input
                            placeholder="Endereço de e-mail"
                            boxStyle={{
                                marginTop: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            placeholderTextColor={themas.Colors.secondary}
                            height={55}
                            value={email}
                            onChangeText={setEmail}
                            IconRight={MaterialIcons}
                            iconRightName="email"
                            style={{ backgroundColor: themas.Colors.bgScreen }}
                        />
                        <Input
                            placeholder="Senha"
                            boxStyle={{
                                marginTop: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 10,
                            }}
                            placeholderTextColor={themas.Colors.secondary}
                            value={password}
                            height={55}
                            onChangeText={setPassword}
                            IconRight={Octicons}
                            iconRightName={showPassword ? "eye-closed" : "eye"}
                            onIconRightPress={() => setShowPassword(!showPassword)}
                            secureTextEntry={showPassword}
                            style={{ backgroundColor: themas.Colors.bgScreen }}
                        />
                    </View>
                    <View style={styles.boxBottom}>
                        <Button 
                        text="Cadastrar" 
                        loading={loading} 
                        onPress={handleRegister}
                        textStyle={{ fontSize: 18, fontFamily: themas.Fonts.medium }}
                        backgroundColor={{ backgroundColor: themas.Colors.blueLigth }}
                        width="100%"
                        />
                    </View>
                    {/* Condicionalmente renderiza a mensagem "Já tem conta? Faça Login" */}
                    {!isKeyboardVisible && (
                        <Text style={styles.textBottom}>
                            Já tem conta? 
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.textBottomCreate}> Faça Login</Text>
                            </TouchableOpacity>
                        </Text>
                    )}
                </View>
            </TouchableWithoutFeedback>
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
        marginTop: 50,
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
    tittlecadastro: {
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
    logo: { 
        width: 300,
        height: 250,
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