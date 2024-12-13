import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Alert } from 'react-native';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  materia: string; 
  dataConclusao: string;
  dataConclusaoReal?: string;
  icon: string;
  color: string;
  status: 'em andamento' | 'em pausa' | 'concluido';
  createdAt: string;
}

interface ActivityContextProps {
  activitiesList: Activity[];
  fetchActivities: () => void;
  handleSave: (activity: Activity, isEdit: boolean, editActivityId: string | null) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  handleEdit: (activity: Activity) => void;
  setOnOpen: (onOpen: () => void) => void;
  onOpen: () => void;
  updateActivityStatus: (id: string, newStatus: 'em andamento' | 'em pausa' | 'concluido') => Promise<void>;
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
          materia: data.materia,
          dataConclusao: data.dataConclusao,
          dataConclusaoReal: data.dataConclusaoReal,
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
          materia: activity.materia, // Adicione a propriedade materia
          dataConclusao: activity.dataConclusao,
          icon: activity.icon,
          color: activity.color,
          status: 'em andamento',
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
    // Implement the edit logic here
  };

  const updateActivityStatus = async (id: string, newStatus: 'em andamento' | 'em pausa' | 'concluido') => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const activityDocRef = doc(db, "users", user.uid, "atividades", id);
      const updateData: Partial<Activity> = {
        status: newStatus,
      };
  
      if (newStatus === 'concluido') {
        updateData.dataConclusaoReal = new Date().toISOString();
      }
  
      await updateDoc(activityDocRef, updateData);
      fetchActivities();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao atualizar o status da atividade. Tente novamente.");
      console.error("Erro ao atualizar status da atividade no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const activityDocRef = doc(db, "users", user.uid, "atividades", id);
      await deleteDoc(activityDocRef);
      fetchActivities(); // Refresh the list of activities
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao apagar a atividade. Tente novamente.");
      console.error("Erro ao apagar a atividade no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActivityContext.Provider value={{ activitiesList, fetchActivities, handleSave, deleteActivity, handleEdit, setOnOpen, onOpen, updateActivityStatus }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);