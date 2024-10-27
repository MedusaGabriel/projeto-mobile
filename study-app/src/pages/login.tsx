import React,{ useEffect, useState } from "react";
import { StyleSheet,Dimensions, TouchableOpacity} from "react-native";
import Logo from '../assets/logo.png';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import {Text, View,Image, Alert} from 'react-native'
import { useNavigation,NavigationProp  } from '@react-navigation/native';
import {MaterialIcons,Octicons} from '@expo/vector-icons';
import { auth } from "../services/firebaseConfig";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function Login (){
    const navigation = useNavigation<NavigationProp<any>>();

    const [email,setEmail]               = useState('');
    const [password,setPassword]         = useState('');
    const [showPassword,setShowPassword] = useState(true);
    const [loading,setLoading]           = useState(false);
    const [signInWithEmailAndPassword, firebaseUser, firebaseloading, error,
      ] = useSignInWithEmailAndPassword(auth);

    //Função para realizar o login
    async function getLogin() {
        setLoading(true);
        if(!email ||!password){
            setLoading(false);
            return Alert.alert('Anteção!!','Informe os campos obrigatórios!')
        }
        const userCredential = await signInWithEmailAndPassword(email, password); 
        if (userCredential) {
            console.log('Login realizado com sucesso!!');
            navigation.reset({ routes: [{ name: 'AppRouter' }] });
        }
    }

    //Monitora se há algum erro e retorna no console e no Alerta
    useEffect(() => {
        if (error) {
            console.log('Erro ao tentar realizar login',error);
            Alert.alert('Erro', 'Falha no login, verifique suas credenciais.');
            setEmail('');
            setPassword('');
            setLoading(false);
        }
    }, [error]);

    return(
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image 
                    source={Logo} 
                    style={style.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={style.boxMid}>
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
                    iconRightName={showPassword?"eye-closed":"eye"}
                    onIconRigthPress={()=>setShowPassword(!showPassword)}
                    secureTextEntry={showPassword}
                />
            </View>
            <View style={style.boxBottom}>
                <Button  text="ENTRAR" loading={loading} onPress={()=>getLogin()}/>
            </View>
            <Text style={style.textBottom}>
                Não tem conta? 
                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={style.textBottomCreate}> Crie agora</Text>
                </TouchableOpacity>
            </Text>
        </View>
    )
}

export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    boxTop:{
        height:Dimensions.get('window').height/3,
        width:'100%',
        // backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center'
    },
    boxMid:{
        height:Dimensions.get('window').height/4,
        // backgroundColor:'blue',
        width:'100%',
        paddingHorizontal:37,
    },
    boxBottom:{
        height:Dimensions.get('window').height/3,
        // backgroundColor:'green',
        width:'100%',
        alignItems:'center',
        justifyContent:'flex-start'
        
    },
    boxInput:{
        width:'100%',
        height:40,
        borderWidth:1,
        borderRadius:40,
        borderColor:'#d7d8d7',
        backgroundColor:'#f1f7fa',
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:30
    },
    logo:{
        width:180,
        height:180,
        marginTop:40
    },
    text:{
        marginTop:35,
        fontSize:18,
        fontWeight:'bold'
    },
    input:{
        // backgroundColor:'red',
        height:'100%',
        width:'100%',
        borderRadius:40,
        // paddingHorizontal:20
    },
    boxIcon:{
        width:50,
        height:50,
        backgroundColor:'red'
    },
    titleInput:{
        marginLeft:5,
        color:'gray',
        marginTop:20
    },
    textBottom:{
        fontSize:16,
        color:'gray'
    },
    textBottomCreate:{
        fontSize:16,
        color:'#878af6'
    }
})