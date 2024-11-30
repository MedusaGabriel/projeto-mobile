import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Alert } from 'react-native';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../services/firebaseConfig";

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  icon: string;
  color: string;
  status: string;
  createdAt: string;
}

interface ActivityContextProps {
  activitiesList: Activity[];
  fetchActivities: () => void;
  handleSave: (activity: Activity, isEdit: boolean, editActivityId: string | null) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (activity: Activity) => void;
  setOnOpen: (onOpen: () => void) => void;
  onOpen: () => void;
}

export const ActivityContext = createContext<ActivityContextProps>({} as ActivityContextProps);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [onOpen, setOnOpen] = useState<() => void>(() => {});

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        setLoading(false);
        return;
      }
      const activitiesRef = collection(db, "users", user.uid, "atividades");
      const querySnapshot = await getDocs(activitiesRef);
      let activitiesList: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activitiesList.push({
          id: doc.id,
          titulo: data.titulo,
          descricao: data.descricao,
          dataConclusao: data.dataConclusao,
          icon: data.icon,
          color: data.color,
          status: data.status,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      setActivitiesList(activitiesList);
      setIsFetched(true);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (activity: Activity, isEdit: boolean, editActivityId: string | null) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const activitiesRef = collection(db, "users", user.uid, "atividades");
      if (isEdit && editActivityId) {
        const activityDocRef = doc(db, "users", user.uid, "atividades", editActivityId);
        await updateDoc(activityDocRef, {
          titulo: activity.titulo,
          descricao: activity.descricao,
          dataConclusao: activity.dataConclusao,
          icon: activity.icon,
          color: activity.color,
          status: activity.status,
          createdAt: activity.createdAt,
        });
        Alert.alert("Sucesso!", "Atividade atualizada com sucesso!");
      } else {
        const activityDocRef = await addDoc(activitiesRef, activity);
        const { id, ...activityWithoutId } = activity;
        const newActivityWithId = { id: activityDocRef.id, ...activityWithoutId };
        setActivitiesList((prevActivities) => [newActivityWithId, ...prevActivities]);
        Alert.alert("Sucesso!", "Atividade salva com sucesso!");
      }
      fetchActivities();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a atividade. Tente novamente.");
      console.error("Erro ao salvar atividade no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    // Implementar lógica de edição se necessário
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const activityDocRef = doc(db, "users", user.uid, "atividades", id);
      await deleteDoc(activityDocRef);
      setActivitiesList((prevActivities) => prevActivities.filter((activity) => activity.id !== id));
      Alert.alert("Sucesso!", "Atividade excluída com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao excluir a atividade. Tente novamente.");
      console.error("Erro ao excluir atividade no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchActivities();
    }
  }, [isFetched]);

  return (
    <ActivityContext.Provider value={{ activitiesList, fetchActivities, handleSave, handleDelete, handleEdit, setOnOpen, onOpen }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);