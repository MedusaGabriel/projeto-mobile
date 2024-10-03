import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Materias = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<Date | undefined>(undefined); // Adicionando estado para o horário
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); // Adicionando estado para exibir o seletor de horário
  const [subjects, setSubjects] = useState<{ name: string; date: string; time: string }[]>([]);

  const handleAddSubject = () => {
    if (subjectName && date && time) {
      const newSubject = { 
        name: subjectName, 
        date: date.toISOString().split('T')[0], 
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setSubjects([...subjects, newSubject]);
      setSubjectName('');
      setDate(undefined);
      setTime(undefined);
      setIsAdding(false);
    } else {
      Alert.alert('Por favor, preencha todos os campos!');
    }
  };

  const handleDeleteSubject = (index: number) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set') {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set') {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Plano de Estudo</Text>

      {isAdding && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome da Matéria"
            value={subjectName}
            onChangeText={setSubjectName}
          />
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>
              {date ? date.toLocaleDateString() : "Selecionar Data"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateButtonText}>
              {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Selecionar Hora"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time" // Modo para selecionar a hora
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleAddSubject}>
            <Text style={styles.submitButtonText}>Adicionar Matéria</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(!isAdding)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={subjects}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.subjectContainer}>
            <Text style={styles.subjectText}>{item.name}</Text>
            <View style={styles.subjectDetails}>
              <Text style={styles.subjectDetailText}>Data: {item.date}</Text>
              <Text style={styles.subjectDetailText}>Hora: {item.time}</Text>
              <TouchableOpacity onPress={() => handleDeleteSubject(index)} style={styles.deleteButton}>
                <Icon name="delete" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.subjectList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#353535',
    paddingTop: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 20,
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
  dateButton: {
    height: 40,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 30,
    color: '#FFF',
  },
  subjectList: {
    marginTop: 20,
    width: '80%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectDetails: {
    marginTop: 5,
  },
  subjectDetailText: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    marginLeft: 10,
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
});

export default Materias;
