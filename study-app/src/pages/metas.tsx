import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../components/Styles/metas';

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

export default Metas;
