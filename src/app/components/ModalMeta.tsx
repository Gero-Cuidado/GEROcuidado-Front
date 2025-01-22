import React, { useEffect, useState } from "react";
import { Modal, Text, Pressable, View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMessage from "./ErrorMessage";
import ModalButtons from "./ModalButtons";
import styles from "./style/stylesModal";

interface IProps {
  visible: boolean;
  callbackFn: (valor: string) => void;
  closeModal: () => void;
  message: string;
  metrica: {
    categoria: string;
    id: string;
    titulo: string;
    descricao: string;
  };
}

interface IErrors {
  valor?: string;
}

export default function ModalMeta({
  visible,
  callbackFn,
  closeModal,
  metrica,
  message,
}: IProps) {
  const [valor, setValor] = useState<string>("");
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  // Validação local do valor
  const validateValue = (valor: string) => {
    let error = "";
    if (!valor) {
      error = "O valor não pode ser vazio.";
    } else if (isNaN(Number(valor))) {
      error = "O valor deve ser numérico.";
    }
    setErros({ valor: error });
    setShowErrors(!!error);
  };

  const handleSave = async () => {
    if (showErrors) return;

    try {
      // Salva a nova meta no AsyncStorage
      const storedMetas = await AsyncStorage.getItem("metas");
      const metas = storedMetas ? JSON.parse(storedMetas) : [];

      const novaMeta = {
        id: Date.now().toString(),
        categoria: metrica.categoria,
        valor: valor,
      };

      metas.push(novaMeta);
      await AsyncStorage.setItem("metas", JSON.stringify(metas));

      callbackFn(valor);
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
    }
  };

  useEffect(() => {
    validateValue(valor);
  }, [valor]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Adicionar uma nova meta</Text>
          <View style={styles.modal}>
            {metrica.categoria === "HIDRATACAO" && (
              <MaterialCommunityIcons
                name="cup-water"
                color="#1075c8"
                size={60}
              />
            )}
            <View style={styles.input}>
              <TextInput
                value={valor}
                onChangeText={setValor}
                style={styles.textInput}
                placeholder="Digite o valor da meta"
                placeholderTextColor="#3D3D3D"
              />
              <View style={styles.erroValor}>
                <ErrorMessage show={showErrors} text={erros.valor} />
              </View>
            </View>
          </View>
          <ModalButtons
            onCancel={closeModal}
            onSave={handleSave}
            showErrors={showErrors}
            setShowErrors={setShowErrors}
            erros={erros}
          />
        </View>
      </View>
    </Modal>
  );
}
