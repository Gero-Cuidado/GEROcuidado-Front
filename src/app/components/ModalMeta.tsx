import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { EMetricas, IMetrica } from "../interfaces/metricas.interface";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import ErrorMessage from "./ErrorMessage";
import { validateValue } from "../shared/helpers/modal.helper";

interface IProps {
  visible: boolean;
  callbackFn: (valor: string) => unknown;
  closeModal: () => unknown;
  message: string;
  metrica: IMetrica;
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
}: Readonly<IProps>) {
  const [valor, setValor] = useState<string>("");
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    validateValue(valor, setShowErrors, setErros);
  }, [valor]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Adicionar uma nova meta</Text>
          <View style={styles.modal}>
            {metrica.categoria == EMetricas.HIDRATACAO && (
              <MaterialCommunityIcons
                name="cup-water"
                color={"#1075c8"}
                size={60}
              />
            )}
            <View style={styles.input}>
              <TextInput
                value={valor}
                onChangeText={setValor}
                style={styles.textInput}
                placeholderTextColor={"#3D3D3D"}
                testID="modal-input"
              />
              <View style={styles.erroValor}>
                <ErrorMessage show={showErrors} text={erros.valor} />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              testID="cancelarBtn"
              style={[styles.button, styles.buttonCancel]}
              onPress={() => closeModal()}
            >
              <Text style={styles.textStyle}>Cancelar</Text>
            </Pressable>
            <Pressable
              testID="callbackBtn"
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (Object.keys(erros).length > 0) {
                  setShowErrors(true);
                } else {
                  callbackFn(valor);
                }
              }}
            >
              <Text style={styles.textStyle}>{"Salvar"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000098",
  },
  modal: {
    flexDirection: "row",
    marginBottom: 30,
  },
  erroValor: {
    padding: 5,
  },
  input: {
    flexDirection: "column",
    alignItems: "center",
  },
  textInput: {
    fontSize: 40,
    width: 150,
    marginLeft: 15,
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2CCDB5",
    marginHorizontal: 15,
  },
  buttonCancel: {
    backgroundColor: "#FF7F7F",
    marginHorizontal: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 35,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
