import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { firestore, auth } from '../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import { themas } from '../global/themes'; 

const Curso = () => {
  const [curso, setCurso] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uid, setUid] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  // Efeito para capturar o UID do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe(); // Limpa o ouvinte de mudanças de estado de autenticação
  }, []);

  // Função para salvar o curso no Firestore
  const salvarCursoNoFirestore = async (uid: string, curso: string) => {  
    try {
      if (!uid || !curso) {
        Alert.alert('Erro', 'Usuário ou curso não informado');
        return;
      }

      // Atualiza o documento do usuário no Firestore com o campo 'curso'
      await updateDoc(doc(firestore, 'users', uid), { curso });
      console.log('Curso salvo com sucesso no Firestore!');
    } catch (error) {
      console.error('Erro ao salvar o curso no Firestore: ', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o curso.');
    }
  };

  // Função chamada ao pressionar o botão "Próximo"
  const getCurso = async () => {
    if (!curso) {
      Alert.alert('Erro', 'Selecione um curso antes de prosseguir');
      return;
    }

    setLoading(true);
    
    // Salva o curso no Firestore
    if (uid) {
      await salvarCursoNoFirestore(uid, curso);
    }

    setLoading(false);
    navigation.navigate('AppRouter');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual seu nível de ensino?</Text>

      <View style={styles.boxMid}>
        {/* Dropdown para seleção de cursos */}
        <RNPickerSelect
          value={curso}
          onValueChange={setCurso}
          placeholder={{
            backgroundColor: themas.Colors.bgSecondary,
            label: 'Qual o seu nível de ensino?',
            value: null,
          }}
          items={[
            { label: 'Ensino Fundamental', value: 'Ensino Fundamental' },
            { label: 'Ensino Médio', value: 'Ensino Médio' },
            { label: 'Ensino Superior', value: 'Ensino Superior' },
            { label: 'Outros', value: 'Outros' },
          ]}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false} // Desativa o estilo nativo do Android
        />

        <View style={styles.boxBottom}>
          <Button text="Próximo" loading={loading} onPress={getCurso} />
        </View>
      </View>
    </View>
  );
};

// Estilos para o PickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 55, // Ajustado para um tamanho mais adequado
    width: '80%', // Ajuste de largura para o dropdown
    borderColor: 'themas.Colors.bgScreen',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12, // Padding mais confortável
    marginTop: 10,
    fontSize: 16,
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.secondary,
    paddingRight: 40, // Espaço à direita para o ícone
    alignSelf: 'center', // Centraliza horizontalmente
    backgroundColor: themas.Colors.bgScreen,
    pointerEvents: 'none', // Impede que o campo de texto seja clicado
  },
  inputAndroid: {
    height: 55, // Altura padrão
    width: '90%', // Largura padrão
    borderColor: 'themas.Colors.bgScreen',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12, // Padding horizontal uniforme
    marginTop: 10,
    fontSize: 16,
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.secondary,
    alignSelf: 'center', // Centralizado horizontalmente
    backgroundColor: '#fff', // Fundo branco
},
  iconContainer: {
    position: 'absolute', 
    top: 14, // Ajusta a posição do ícone dentro do campo
    right: 10, // Ajusta a distância do ícone à direita
    pointerEvents: 'auto', // Faz com que o ícone seja interativo
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: themas.Colors.bgSecondary,
  },
  text: {
    marginTop: 35,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', // Garantir que o texto esteja centralizado
    marginBottom: 20, // Espaço abaixo do texto
  },
  boxMid: {
    width: '100%', // Usar 100% da largura disponível
    alignItems: 'center', // Centralizar o conteúdo dentro da caixa
  },
  boxBottom: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
},
});

export default Curso;