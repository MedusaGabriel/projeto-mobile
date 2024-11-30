import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useActivity } from '../Context/authcontextatividades';
import { themas } from '../../global/themes';
import { Flag } from '../Flags/flagsatividades';
import CardAtividades from '../Modal/cardatividades'; // Certifique-se de que o caminho está correto

interface Activity {
  id: string;
  titulo: string;
  materia: string;
  descricao: string;
  dataConclusao: string;
  createdAt: any;
  icon: string;
  color: string;
  status: 'em andamento' | 'em pausa' | 'concluido';
}

const flags = [
  { caption: 'em pausa', color: themas.Colors.gray },
  { caption: 'concluido', color: themas.Colors.green },
  { caption: 'em andamento', color: themas.Colors.blueLigth }
];

const adjustDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date;
};

const AtividadesList = () => {
  const [loading, setLoading] = useState(true);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const { activitiesList, fetchActivities } = useActivity();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        await fetchActivities();
        setActivitiesLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [fetchActivities, activitiesLoaded]);

  const handleOpenModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedActivity(null);
  };

  const renderActivity = ({ item }: { item: Activity }) => {
    let formattedDate = 'Data inválida';
    let dateLabel = 'Previsão para conclusão:';

    let dateToFormat = item.dataConclusao || item.createdAt;

    if (item.status === 'concluido' && item.dataConclusao) {
      dateToFormat = item.dataConclusao;
      dateLabel = 'Atividade concluída em:';
    }

    try {
      const parsedDate = adjustDate(dateToFormat);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = format(parsedDate, 'dd/MM/yyyy');
      }
    } catch (error) {
      console.error("Erro ao formatar data:", error);
    }

    const flag = flags.find(f => f.caption === item.status);

    return (
      <TouchableOpacity onPress={() => handleOpenModal(item)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.card}>
            <View style={styles.row}>
              <MaterialIcons name={item.icon as any} size={30} color={item.color} />
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.titulo}</Text>
                </View>
                <Text style={styles.description}>{item.descricao}</Text>
                <Text style={styles.materia}>Matéria: {item.materia}</Text>
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.dateAndFlagContainer}>
              <Text style={styles.date}>{dateLabel} {formattedDate}</Text>
              {flag && <Flag caption={flag.caption} color={flag.color} />}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={activitiesList}
          renderItem={renderActivity}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Combinação de id e índice para garantir unicidade
          contentContainerStyle={styles.flatList}
        />
      )}
      {selectedActivity && (
        <CardAtividades
          visible={modalVisible}
          onClose={handleCloseModal}
          activity={selectedActivity}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: themas.Colors.gray,
  },
  flatList: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: themas.Colors.bgSecondary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themas.Colors.primary,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: themas.Colors.primary,
    marginHorizontal: 5,
  },
  materia: {
    paddingTop: 10,
    fontSize: 16,
    color: themas.Colors.primary,
  },
  description: {
    fontSize: 14,
    color: themas.Colors.gray,
    width: '100%',
  },
  date: {
    fontSize: 12,
    color: themas.Colors.secondary,
  },
  subtitulo: {
    fontFamily: themas.Fonts.regular,
    color: themas.Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  horizontalLine: {
    borderBottomColor: themas.Colors.gray,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  dateAndFlagContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
    justifyContent: 'flex-end',
  },
});

export default AtividadesList;