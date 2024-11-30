import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { themas } from '../global/themes';
import { AntDesign } from '@expo/vector-icons';
import { useGoal } from '../components/Context/authcontextmetas';
import MetasList from '../components/Listas/metaslist';
import MetasModal from '../components/Modal/metasmodal';

export default function Metas() {
  const { onOpen } = useGoal();

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      <Text style={styles.title}>Minhas Metas</Text>
      <TouchableOpacity style={styles.button} onPress={onOpen}>
        <AntDesign name="plus" size={40} color={themas.Colors.primary} />
      </TouchableOpacity>
      <MetasList />
      <MetasModal/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingBottom: 0,
    backgroundColor: themas.Colors.bgScreen,
    alignItems: 'center',
  },
  title: { 
    fontSize: 20, 
    color: themas.Colors.primary, 
    fontFamily: themas.Fonts.bold,
    marginBottom: 10,
  },
  button: {
    position: "absolute",
    bottom: 15,
    width: 60, 
    height: 60,
    backgroundColor: themas.Colors.blueLigth, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,  
    zIndex: 10, 
  },
  buttonText: {
    fontSize: 16,
    fontFamily: themas.Fonts.bold,
  },
});