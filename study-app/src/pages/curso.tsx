import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation,NavigationProp  } from '@react-navigation/native';
import { style } from './login';

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
            navigation.reset({routes:[{name :'Adcmaterias'}]});
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela cursos</Text>
      <Input 
                    value={curso}
                    onChangeText={setCurso}
                    IconRigth={() => <AntDesign size={24} color="black" />}
                    iconRightName="curso"
                    onIconRigthPress={()=>console.log('CURSO')}
                />
        <View style={style.boxBottom}>
            <Button  text="Próximo" loading={loading} onPress={()=>getCurso()}/>
        </View>
    </View>
    
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  boxBottom: {
    height:Dimensions.get('window').height/3,
    width:'100%',
    alignItems:'center',
    justifyContent:'flex-start'
    },
});

export default Curso;
