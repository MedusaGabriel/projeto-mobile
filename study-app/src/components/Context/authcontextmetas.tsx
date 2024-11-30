import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Alert } from 'react-native';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from "../../services/firebaseConfig";

interface Goal {
  id: string;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  dataConclusaoReal?: string;
  concluido: boolean;
  createdAt: string;
}

interface GoalContextProps {
  goalsList: Goal[];
  fetchMetas: () => void;
  handleSave: (goal: Goal, isEdit: boolean, editGoalId: string | null) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  toggleConcluido: (id: string) => Promise<void>;
  handleEdit: (goal: Goal) => void;
  setOnOpen: (onOpen: () => void) => void;
  onOpen: () => void;
}

const GoalContext = createContext<GoalContextProps>({} as GoalContextProps);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataConclusao, setDataConclusao] = useState<Date | null>(null);
  const [dataConclusaoReal, setDataConclusaoReal] = useState<Date | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editGoalId, setEditGoalId] = useState<string | null>(null);
  const [goalsList, setGoalsList] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [onOpen, setOnOpen] = useState<() => void>(() => {});

  const fetchMetas = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        setLoading(false);
        return;
      }
      const metasRef = collection(db, "users", user.uid, "metas");
      const querySnapshot = await getDocs(metasRef);
      let metasList: Goal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        metasList.push({
          id: doc.id,
          titulo: data.titulo,
          descricao: data.descricao,
          dataConclusao: data.dataConclusao,
          dataConclusaoReal: data.dataConclusaoReal,
          concluido: data.concluido || false,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      metasList = metasList.sort((a, b) => {
        if (a.concluido === b.concluido) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.concluido ? 1 : -1;
      });
      setGoalsList(metasList);
      setIsFetched(true);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (goal: Goal, isEdit: boolean, editGoalId: string | null) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const metasRef = collection(db, "users", user.uid, "metas");
      if (isEdit && editGoalId) {
        const goalDocRef = doc(db, "users", user.uid, "metas", editGoalId);
        await updateDoc(goalDocRef, {
          titulo: goal.titulo,
          descricao: goal.descricao,
          dataConclusao: goal.dataConclusao,
          dataConclusaoReal: goal.dataConclusaoReal,
          concluido: goal.concluido,
          createdAt: goal.createdAt,
        });
        Alert.alert("Sucesso!", "Meta atualizada com sucesso!");
      } else {
        const goalDocRef = await addDoc(metasRef, goal);
        const { id, ...goalWithoutId } = goal;
        const newGoalWithId = { id: goalDocRef.id, ...goalWithoutId };
        setGoalsList((prevGoals) => [newGoalWithId, ...prevGoals]);
        Alert.alert("Sucesso!", "Meta salva com sucesso!");
      }
      fetchMetas();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a meta. Tente novamente.");
      console.error("Erro ao salvar meta no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal: Goal) => {
    setTitulo(goal.titulo);
    setDescricao(goal.descricao);
    setDataConclusao(new Date(goal.dataConclusao));
    setDataConclusaoReal(goal.dataConclusaoReal ? new Date(goal.dataConclusaoReal) : null);
    setIsEdit(true);
    setEditGoalId(goal.id);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const metaDocRef = doc(db, "users", user.uid, "metas", id);
      await deleteDoc(metaDocRef);
      setGoalsList((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
      Alert.alert("Sucesso!", "Meta excluída com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao excluir a meta. Tente novamente.");
      console.error("Erro ao excluir meta no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleConcluido = async (id: string) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }
      const meta = goalsList.find((goal) => goal.id === id);
      if (!meta) {
        console.error("Meta não encontrada!");
        return;
      }
      const newConcluidoStatus = !meta.concluido;
      const metaDocRef = doc(db, "users", user.uid, "metas", id);
      await updateDoc(metaDocRef, { concluido: newConcluidoStatus });
      setGoalsList((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === id ? { ...goal, concluido: newConcluidoStatus } : goal
        )
      );
      fetchMetas();
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchMetas();
    }
  }, [isFetched]);

  return (
    <GoalContext.Provider value={{ goalsList, fetchMetas, handleSave, handleDelete, toggleConcluido, handleEdit, setOnOpen, onOpen }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => useContext(GoalContext);