Este projeto é um aplicativo móvel desenvolvido com React Native que permite aos usuários gerenciar metas e atividades. Ele utiliza Firebase para autenticação e armazenamento de dados. Abaixo está uma explicação detalhada de cada página e componente do projeto.

MetasList.tsx
Descrição: Este componente exibe uma lista de metas. Ele permite que os usuários excluam metas deslizando para a esquerda.
useGoal: Hook personalizado para gerenciar metas.
swipeableRefs: Referências para os componentes Swipeable.
loading: Estado para gerenciar o carregamento.
renderRightActions: Renderiza o botão de exclusão ao deslizar para a esquerda.
handleDeleteGoal: Exibe um alerta de confirmação antes de excluir uma meta.
adjustDate: Ajusta a data para o fuso horário correto.
renderMeta: Renderiza cada meta na lista, incluindo título, descrição e data formatada.
handleContentSizeChange: Atualiza a altura total do conteúdo da lista.
isGradientVisible: Determina se o gradiente deve ser exibido com base no número de metas.

MetasModal.tsx
Descrição: Este componente é um modal que permite aos usuários criar ou editar metas.
useGoal: Hook personalizado para gerenciar metas.
modalizeRef: Referência para o componente Modalize.
Estados: Gerencia os estados dos campos de entrada, como título, descrição e data de conclusão.
handleSaveGoal: Salva a meta no Firebase.
resetForm: Reseta os campos do formulário.
_container: Renderiza o conteúdo do modal.

AtividadesList.tsx
Descrição: Este componente exibe uma lista de atividades. Ele permite que os usuários visualizem detalhes das atividades em um modal.
useActivity: Hook personalizado para gerenciar atividades.
loading: Estado para gerenciar o carregamento.
renderActivity: Renderiza cada atividade na lista, incluindo título, descrição e data formatada.
handleOpenModal: Abre o modal de detalhes da atividade.
handleCloseModal: Fecha o modal de detalhes da atividade.

AtividadesModal.tsx
Descrição: Este componente é um modal que permite aos usuários criar ou editar atividades.
useActivity: Hook personalizado para gerenciar atividades.
modalizeRef: Referência para o componente Modalize.
Estados: Gerencia os estados dos campos de entrada, como título, descrição, data de conclusão, ícone e cor.
handleSaveActivity: Salva a atividade no Firebase.
resetForm: Reseta os campos do formulário.
handleSelectIcon: Seleciona um ícone.
handleSelectColor: Seleciona uma cor.
_container: Renderiza o conteúdo do modal.

CardAtividades.tsx
Descrição: Este componente é um modal que exibe os detalhes de uma atividade e permite que os usuários alterem o status ou excluam a atividade.
useActivity: Hook personalizado para gerenciar atividades.
Estados: Gerencia o estado do status da atividade.
handleChangeStatus: Altera o status da atividade.
handleDelete: Exibe um alerta de confirmação antes de excluir a atividade.
renderActivity: Renderiza os detalhes da atividade.

AuthContextAtividades.tsx
Descrição: Este arquivo define o contexto e o provider para gerenciar atividades.
ActivityContext: Contexto para gerenciar atividades.
ActivityProvider: Provider que fornece o contexto para os componentes filhos.
fetchActivities: Busca as atividades do Firebase.
handleSave: Salva uma atividade no Firebase.
handleEdit: Define os estados para editar uma atividade.
updateActivityStatus: Atualiza o status de uma atividade no Firebase.
deleteActivity: Exclui uma atividade do Firebase.

AuthContextMetas.tsx
Descrição: Este arquivo define o contexto e o provider para gerenciar metas.
GoalContext: Contexto para gerenciar metas.
GoalProvider: Provider que fornece o contexto para os componentes filhos.
fetchMetas: Busca as metas do Firebase.
handleSave: Salva uma meta no Firebase.
handleEdit: Define os estados para editar uma meta.
toggleConcluido: Alterna o status de conclusão de uma meta no Firebase.
handleDelete: Exclui uma meta do Firebase.

FlagsAtividades.tsx
Descrição: Este componente exibe uma flag com uma legenda e uma cor.
Props: Recebe as propriedades caption, color e selected.
Flag: Renderiza a flag com a legenda e a cor fornecidas.

IconColorPickerModal.tsx
Descrição: Este componente é um modal que permite aos usuários selecionar um ícone ou uma cor.
Props: Recebe as propriedades visible, onClose, onSelectIcon, onSelectColor e type.
handleSelectIcon: Seleciona um ícone.
handleSelectColor: Seleciona uma cor.
Modal: Renderiza o modal com a lista de ícones ou cores.

FirebaseConfig.js
Descrição: Este arquivo configura e inicializa o Firebase.
firebaseConfig: Configurações do Firebase.
initializeApp: Inicializa o Firebase.
initializeAuth: Inicializa a autenticação do Firebase.
getFirestore: Inicializa o Firestore.
Exportações: Exporta as instâncias de auth e firestore.

Metas.tsx
Descrição: Este componente é a tela principal para gerenciar metas.
useGoal: Hook personalizado para gerenciar metas.
onOpen: Função para abrir o modal de metas.
MetasList: Componente que exibe a lista de metas.
MetasModal: Componente que exibe o modal de metas.

Atividades.tsx
Descrição: Este componente é a tela principal para gerenciar atividades.
useActivity: Hook personalizado para gerenciar atividades.
onOpen: Função para abrir o modal de atividades.
MetasList: Componente que exibe a lista de atividades.
AtividadesModal: Componente que exibe o modal de atividades.