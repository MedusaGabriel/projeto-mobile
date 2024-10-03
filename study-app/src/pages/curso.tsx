import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Button } from "../components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation,NavigationProp  } from '@react-navigation/native';
import { style } from './login';
import { Input } from '../components/Input';

const Curso = () => {
    const [curso,setCurso]               = useState('');
    const [loading,setLoading]           = useState(false);

    const navigation = useNavigation<NavigationProp<any>>();
    
    async function getCurso() {
        try {
            setLoading(true)
            if(!curso){
                setLoading(false);
                return Alert.alert('Curso não informado!!')
            }
            navigation.navigate('Adcmaterias');
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Para o que você tá estudando?</Text>
      <View style={style.boxMid}>
      <Input 
                    value={curso}
                    onChangeText={setCurso}
                    IconRigth={() => <AntDesign size={24} color="black" />}
                    iconRightName="curso"
                    placeholder="Ex: Admistração, Ciências Contábeis..."
                    onIconRigthPress={()=>console.log('CURSO')}
                />
        <View style={style.boxBottom}>
            <Button  text="Próximo" loading={loading} onPress={()=>getCurso()}/>
        </View>
      </View>
    </View>
    
  );
};

export const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
},
  text:{
    marginTop:35,
    fontSize:20,
    fontWeight:'bold'
  },
  boxMid:{
    height:Dimensions.get('window').height/4,
    width:'100%',
    paddingHorizontal:7,
},
boxBottom:{
  height:Dimensions.get('window').height/3,
  marginTop:20,
  width:'100%',
  alignItems:'center',
  justifyContent:'flex-start'
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
});

export default Curso;
