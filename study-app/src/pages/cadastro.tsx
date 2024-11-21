import React, { useEffect, useState } from "react";import { StyleSheet, TouchableOpacity } from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Text, View, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../services/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';

export default function Cadastro() {
    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); 
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const [createUserWithEmailAndPassword, firebaseUser, firebaseLoading, error
      ] = useCreateUserWithEmailAndPassword(auth);
    
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
                criação: new Date().toISOString() // Adiciona a data de criação
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
})