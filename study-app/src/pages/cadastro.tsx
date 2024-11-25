import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Text, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../services/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { themas } from "../global/themes";

export default function Cadastro() {
    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); 
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    
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
                    hour: '2-digit',
                    minute: '2-digit',
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
            // Verifica se o erro é de email já em uso
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Erro', 'Este e-mail já está em uso. Tente outro.');
            } else {
                Alert.alert('Erro', 'Houve um problema ao criar sua conta. Tente novamente.');
            }
        }
    }, [error]);

    async function handleRegister() {
        if (!email || !password || !username) {
            return Alert.alert('Atenção!!', 'Informe os campos obrigatórios!');
        }

        setLoading(true);
        // Cria o usuário com o email e senha
        await createUserWithEmailAndPassword(email, password);
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.boxTop}>
                <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Cadastre-se</Text>
            </View>
            <View style={styles.boxCenter}>
                <Input
                    placeholder="Nome de usuário"
                    placeholderTextColor={themas.Colors.secondary}
                    value={username}
                    height={55}
                    onChangeText={setUsername}
                    IconRigth={MaterialIcons}
                    iconRightName="person"
                    style={{ backgroundColor: themas.Colors.bgScreen }}
                />
                <Input
                    placeholder="Endereço de e-mail"
                    placeholderTextColor={themas.Colors.secondary}
                    height={55}
                    value={email}
                    onChangeText={setEmail}
                    IconRigth={MaterialIcons}
                    iconRightName="email"
                    style={{ backgroundColor: themas.Colors.bgScreen }}

                />
                <Input
                    placeholder="Senha"
                    placeholderTextColor={themas.Colors.secondary}
                    value={password}
                    height={55}
                    onChangeText={setPassword}
                    IconRigth={Octicons}
                    iconRightName={showPassword ? "eye-closed" : "eye"}
                    onIconRigthPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={showPassword}
                    style={{ backgroundColor: themas.Colors.bgScreen }}

                />
            </View>
            <View style={styles.boxBottom}>
                <Button text="Cadastrar" loading={loading} onPress={handleRegister} />
                </View>
                <Text style={styles.textBottom}>
                    Já tem conta? 
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.textBottomCreate}> Faça Login</Text>
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
        paddingHorizontal: 20,
        width: '100%',
    },
    boxTop: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -5,  // Aumentei o espaçamento superior
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold', 
    },
    boxCenter: {
        flex: 0.5,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 30,  // Ajuste de espaçamento entre campos e o botão
    },
    boxBottom: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    
    logo: {
        width: 180, // Ajuste do tamanho da logo
        height: 180, // Ajuste do tamanho da logo
        marginBottom: 50, // Ajuste do espaçamento inferior da logo
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
