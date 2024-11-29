import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { themas } from '../global/themes';

const Atividades = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(undefined);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | undefined>(undefined);
  const [subjects, setSubjects] = useState<{ name: string; day: string; timeRange: string }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  const timeRanges = ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00', '18h00 - 20h00', '20h00 - 22h00'];

  const handleAddSubject = () => {
    if (subjectName && dayOfWeek && selectedTimeRange) {
      if (subjects.some(subject => subject.name === subjectName && editIndex === null)) {
        Alert.alert('Atenção', 'Essa matéria já foi adicionada!');
        return;
      }

      const newSubject = {
        name: subjectName,
        day: dayOfWeek,
        timeRange: selectedTimeRange,
      };

      if (editIndex !== null) {
        const updatedSubjects = subjects.map((subject, index) => (index === editIndex ? newSubject : subject));
        setSubjects(updatedSubjects);
        setEditIndex(null);
      } else {
        setSubjects([...subjects, newSubject]);
      }

      setSubjectName('');
      setDayOfWeek(undefined);
      setSelectedTimeRange(undefined);
      setIsAdding(false);
    } else {
      Alert.alert('Por favor, preencha todos os campos!');
    }
  };

  const handleDeleteSubject = (index: number) => {
    Alert.alert(
      'Confirmar Remoção',
      'Você tem certeza que deseja remover essa matéria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => {
          const updatedSubjects = subjects.filter((_, i) => i !== index);
          setSubjects(updatedSubjects);
        }},
      ]
    );
  };

  const handleEditSubject = (index: number) => {
    const subjectToEdit = subjects[index];
    setSubjectName(subjectToEdit.name);
    setDayOfWeek(subjectToEdit.day);
    setSelectedTimeRange(subjectToEdit.timeRange);
    setEditIndex(index);
    setIsAdding(true);
  };

  return (
    <View style={[{ paddingTop: 60 }, styles.container]}>
      <Text style={styles.title}>Minhas atividades</Text>

      {isAdding && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome da Matéria"
            value={subjectName}
            onChangeText={setSubjectName}
          />
          
          <Text style={styles.label}>Selecione o dia da semana:</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, dayOfWeek === day && styles.selectedDayButton]}
                onPress={() => setDayOfWeek(day)}
              >
                <Text style={styles.dayButtonText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Selecione o horário:</Text>
          <View style={styles.timeRangeContainer}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.timeRangeButton, selectedTimeRange === range && styles.selectedTimeRangeButton]}
                onPress={() => setSelectedTimeRange(range)}
              >
                <Text style={styles.timeRangeText}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleAddSubject}>
            <Text style={styles.submitButtonText}>{editIndex !== null ? 'Atualizar Matéria' : 'Adicionar Matéria'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={subjects}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectText}>{item.name}</Text>
            <Text style={styles.subjectDetailText}>Dia: {item.day}</Text>
            <Text style={styles.subjectDetailText}>Horário: {item.timeRange}</Text>
            <View style={styles.subjectActions}>
              <TouchableOpacity onPress={() => handleEditSubject(index)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSubject(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.subjectList}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(!isAdding)}>
        <AntDesign name="plus" size={40} color={themas.Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

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
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: themas.Fonts.regular,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  selectedDayButton: {
    backgroundColor: '#007bff',
  },
  dayButtonText: {
    color: '#fff',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  timeRangeButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  selectedTimeRangeButton: {
    backgroundColor: '#007bff',
  },
  timeRangeText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
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
  subjectContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    width: '80%',
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectDetailText: {
    fontSize: 14,
    color: '#555',
  },
  subjectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    padding: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFF',
  },
  deleteButtonText: {
    color: '#FFF',
  },
  subjectList: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
  },
});

export default Atividades;
