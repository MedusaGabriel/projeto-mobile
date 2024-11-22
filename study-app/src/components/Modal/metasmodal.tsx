import React from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function MetasModal({ visible, onClose, onSave, novaMeta, setNovaMeta }: any) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Criar Meta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da Meta"
          value={novaMeta.nome}
          onChangeText={(text) => setNovaMeta({ ...novaMeta, nome: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Data (ex: 2024-11-30)"
          value={novaMeta.data}
          onChangeText={(text) => setNovaMeta({ ...novaMeta, data: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Prioridade (baixa, média, alta)"
          value={novaMeta.prioridade}
          onChangeText={(text) => setNovaMeta({ ...novaMeta, prioridade: text })}
        />
        <View style={styles.buttonContainer}>
          <Button title="Salvar" onPress={onSave} />
          <Button title="Cancelar" color="red" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
});
