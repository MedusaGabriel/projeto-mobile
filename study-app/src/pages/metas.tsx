import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

const Metas = () => {
  const [goal, setGoal] = useState<string>('');
  const [goals, setGoals] = useState<Goal[]>([]);

  const handleInputChange = (text: string) => {
    setGoal(text);
  };

  const handleAddGoal = () => {
    if (goal.trim()) {
      const newGoal: Goal = {
        id: Date.now(), // Gerar um ID único baseado no timestamp
        text: goal,
        completed: false,
      };
      setGoals([...goals, newGoal]);
      setGoal('');
    }
  };

  const handleToggleGoal = (id: number) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <TouchableOpacity onPress={() => handleToggleGoal(item.id)}>
      <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adicione sua Meta:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua meta aqui"
        value={goal}
        onChangeText={handleInputChange}
      />
      <Button title="Adicionar Meta" onPress={handleAddGoal} />

      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={item => item.id.toString()}
        style={styles.goalList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  goalList: {
    marginTop: 20,
    width: '100%',
  },
  goalText: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default Metas;