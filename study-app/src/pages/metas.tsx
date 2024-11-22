import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';
import { themas } from '../global/themes';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
  dateAdded: string;
  dateCompleted?: string; // Adicionado para armazenar a data de conclusão
}

const Metas = () => {
  const [goal, setGoal] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (text: string) => {
    setGoal(text);
  };

  const handleAddGoal = () => {
    if (goal.trim() && date) {
      const newGoal: Goal = {
        id: Date.now(),
        text: goal,
        completed: false,
        dateAdded: date.toISOString().split('T')[0],
      };
      setGoals([...goals, newGoal]);
      setGoal('');
      setDate(undefined);
      setShowForm(false);
    } else {
      Alert.alert('Erro', 'Por favor, preencha a meta e selecione a data.');
    }
  };

  const handleToggleGoal = (id: number) => {
    const updatedGoals = goals.map(g => {
      if (g.id === id) {
        // Se a meta for concluída, registra a data de conclusão
        return {
          ...g,
          completed: !g.completed,
          dateCompleted: !g.completed ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return g;
    });
    setGoals(updatedGoals);
  };

  const handleRemoveGoal = (id: number) => {
    Alert.alert(
      "Remover Meta",
      "Você tem certeza que deseja remover esta meta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => {
            const updatedGoals = goals.filter(g => g.id !== id);
            setGoals(updatedGoals);
          },
        },
      ]
    );
  };

  const renderGoal = ({ item }: { item: Goal }) => {
    return (
      <View style={styles.goalContainer}>
        <TouchableOpacity
          style={styles.goalItem}
          onPress={() => handleToggleGoal(item.id)}
        >
          <Text style={[styles.goalText, item.completed && styles.completedGoalText]}>
            {item.completed ? "✔️ " : ""}{item.text}
          </Text>
          <Text style={styles.dateText}>Adicionado em: {item.dateAdded}</Text>
          {item.completed && (
            <Text style={styles.completedDateText}>Concluído em: {item.dateCompleted}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveGoal(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setModalVisible(false);
    if (event.type === 'set') {
      setDate(selectedDate);
    }
  };

  return (
    <View style={[{ paddingTop: 50 }, styles.container]}>
      <Text style={styles.title}>Defina suas Metas</Text>
      <Text style={styles.subtitle}>Organize seus objetivos e alcance suas conquistas!</Text>

      {showForm && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Adicione sua Meta:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua meta aqui"
            value={goal}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity style={styles.dateButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.dateButtonText}>
              {date ? date.toLocaleDateString() : "Selecionar a Data"}
            </Text>
          </TouchableOpacity>

          {/* Modal para selecionar a data */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione a Data</Text>
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                />
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.submitButton} onPress={handleAddGoal}>
            <Text style={styles.submitButtonText}>Adicionar Meta</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={item => item.id.toString()}
        style={styles.goalList}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.addButtonText}>{showForm ? '-' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: themas.Colors.bgScreen,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  goalList: {
    marginTop: 20,
    width: '100%',
  },
  goalContainer: {
    marginVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Text Styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  goalItem: {
    flex: 1,
    padding: 10,
  },
  goalText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
  completedGoalText: {
    textDecorationLine: 'none',
    color: '#333',
  },
  completedDateText: {
    fontSize: 12,
    color: 'green',
    fontStyle: 'italic',
  },

  // Input Styles
  input: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dateButton: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },

  // Button Styles
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 15,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF4136',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Metas;
