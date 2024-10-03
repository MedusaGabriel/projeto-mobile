import React, {useState} from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput } from 'react-native';

interface Subject {
  name: string;
  schedule: string; // Você pode usar um formato mais complexo se necessário
}

const Materias = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleAddSubject = () => {
    if (!name || !schedule) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const newSubject: Subject = {
      name,
      schedule,
    };

    setSubjects([...subjects, newSubject]);
    setName('');
    setSchedule('');
    alert('Matéria adicionada com sucesso!');
  };

  const renderItem = ({ item }: { item: Subject }) => (
    <View style={styles.subjectItem}>
      <Text style={styles.subjectName}>{item.name}</Text>
      <Text>Horário: {item.schedule}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plano de Estudo</Text>

      {/* Campos para adicionar nova matéria */}
      <TextInput
        style={styles.input}
        placeholder="Nome da matéria"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Dias e horários das aulas"
        value={schedule}
        onChangeText={setSchedule}
      />
      <Button title="Adicionar Matéria" onPress={handleAddSubject} />

      {/* Lista de matérias */}
      <FlatList
        data={subjects}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.subjectList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#353535',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  subjectItem: {
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 5,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subjectList: {
    marginTop: 20,
  },
});

export default Materias;
