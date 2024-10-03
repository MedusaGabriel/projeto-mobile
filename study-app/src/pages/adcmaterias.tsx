import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation,NavigationProp  } from '@react-navigation/native';
import { style } from './login';

const Adcmat = () => {
    const [materia, setMateria]          = useState('');
    const [loading,setLoading]           = useState(false);

    const navigation = useNavigation<NavigationProp<any>>();
    
    async function getMateria() {
        try {
            setLoading(true)
            if(!materia){
                setLoading(false);
                return Alert.alert('Materias não informadas!!')
            }
            navigation.navigate('AppRouter');
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Materia</Text>
      <Input 
                    value={materia}
                    onChangeText={setMateria}
                    IconRigth={() => <AntDesign size={24} color="black" />}
                    iconRightName="curso"
                    onIconRigthPress={()=>console.log('MATERIA')}
                />
        <View style={style.boxBottom}>
            <Button  text="Próximo" loading={loading} onPress={()=>getMateria()}/>
        </View>
    </View>
    
  );
};

export default Adcmat;

export const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
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