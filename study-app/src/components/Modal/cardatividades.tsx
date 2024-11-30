import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { themas } from "../../global/themes";
import { Flag } from "../Flags/flagsatividades";
import { useActivity } from "../Context/authcontextatividades";

interface Activity {
  createdAt: any;
  id: string;
  titulo: string;
  descricao: string;
  status: 'em andamento' | 'em pausa' | 'concluido';
  dataConclusao: string;
  icon: string;
  color: string;
}

interface CardAtividadesProps {
  visible: boolean;
  onClose: () => void;
  activity: Activity;
}

const flags = [
  { caption: 'em pausa', color: themas.Colors.gray },
  { caption: 'em andamento', color: themas.Colors.blueLigth },
  { caption: 'concluido', color: themas.Colors.green }
];

const CardAtividades: React.FC<CardAtividadesProps> = ({ visible, onClose, activity }) => {
  const { updateActivityStatus, fetchActivities, deleteActivity } = useActivity();
  const [status, setStatus] = useState(activity.status);

  const handleChangeStatus = async (newStatus: 'em andamento' | 'em pausa' | 'concluido') => {
    await updateActivityStatus(activity.id, newStatus);
    setStatus(newStatus);
    await fetchActivities(); // Atualize a lista de atividades
    onClose();
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja apagar esta atividade?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", onPress: async () => {
          await deleteActivity(activity.id);
          await fetchActivities();
          onClose();
        }},
      ],
      { cancelable: true }
    );
  };

  const renderActivity = () => {
    let formattedDate = 'Data inválida';
    let dateLabel = 'Previsão para conclusão:';

    let dateToFormat = activity.dataConclusao || activity.createdAt;

    if (activity.status === 'concluido' && activity.dataConclusao) {
      dateToFormat = activity.dataConclusao;
      dateLabel = 'Atividade concluída em:';
    }

    // Formate a data aqui, se necessário
    // formattedDate = formatDate(dateToFormat);

    return (
      <View>
        <Text style={styles.date}>{dateLabel} {formattedDate}</Text>
        {/* Renderize outras informações da atividade aqui */}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={24} color={themas.Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={themas.Colors.primary} />
            </TouchableOpacity>
          </View>
          <MaterialIcons name={activity.icon as any} size={50} color={activity.color} />
          <Text style={styles.title}>{activity.titulo}</Text>
          <Text style={styles.description}>{activity.descricao}</Text>
          {renderActivity()}
          <View style={styles.flagsContainer}>
            {flags.map((flag) => (
              <TouchableOpacity key={flag.caption} onPress={() => handleChangeStatus(flag.caption as any)}>
                <Flag caption={flag.caption} color={flag.color} selected={status === flag.caption} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: '80%',
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteButton: {
    alignSelf: 'flex-start',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themas.Colors.primary,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: themas.Colors.gray,
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: themas.Colors.secondary,
    marginBottom: 20,
  },
  flagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default CardAtividades;