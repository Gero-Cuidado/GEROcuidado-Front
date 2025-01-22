import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NaoAutenticado from "../../components/NaoAutenticado";
import { View, StyleSheet, Pressable, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { FlatList } from "react-native";
import ModalMetrica from "../../components/ModalMetrica";
import ModalMeta from "../../components/ModalMeta";
import CardValorMetrica from "../../components/CardValorMetrica";

export default function VisualizarMetrica() {
  const params = useLocalSearchParams();
  const [user, setUser] = useState<any | undefined>(undefined);
  const [token, setToken] = useState<string>("");
  const [valueMetrica, setValueMetrica] = useState<any[]>([]);
  const [idoso, setIdoso] = useState<any>();
  const [showLoading, setShowLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMetaVisible, setModalMetaVisible] = useState(false);
  const [meta, SetMeta] = useState(params.valorMaximo);
  const [somaMeta, setSomaMeta] = useState(0);

  const handleUser = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string);
      setUser(usuario);
    });

    AsyncStorage.getItem("token").then((response) => {
      setToken(response as string);
    });
  };

  const getIdoso = () => {
    AsyncStorage.getItem("idoso").then((idosoString) => {
      if (idosoString) {
        const idosoPayload = JSON.parse(idosoString);
        setIdoso(idosoPayload);
      }
    });
  };

  const getMetricasValues = async () => {
    try {
      setShowLoading(true);
      // Removido código de banco de dados e interação com services/metrica
      setValueMetrica([{ valor: 80, dataHora: new Date() }, { valor: 90, dataHora: new Date() }]); // Exemplo estático para o front-end
    } catch (err) {
      console.log("Erro ao buscar valores de metrica:", err);
    } finally {
      setShowLoading(false);
    }
  };

  const novoValor = () => {
    setModalVisible(true);
  };

  const novaMeta = () => {
    setModalMetaVisible(true);
  };

  const salvar = async (valor: string) => {
    try {
      setShowLoading(true);
      // Simula a gravação de um novo valor de métrica no front-end
      setValueMetrica([...valueMetrica, { valor, dataHora: new Date() }]);
      setModalVisible(false);
    } catch (err) {
      console.log("Erro ao salvar valor de metrica:", err);
    } finally {
      setShowLoading(false);
    }
  };

  const back = () => {
    router.replace({
      pathname: "private/tabs/registros",
    });
  };

  const calcular = () => {
    // Exemplo de cálculo de IMC estático, sem backend
    const altura = 170; // Simulado, em cm
    const peso = 70; // Simulado, em kg
    const alturaMetro = altura / 100;
    const imc = (peso / (alturaMetro * alturaMetro)).toFixed(2);
    salvar(imc);
  };

  const adicionarMeta = async (valorMaximo: string) => {
    try {
      setShowLoading(true);
      SetMeta(valorMaximo);
      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Meta adicionada com sucesso.",
      });
      setModalMetaVisible(false);
      getMetricasValues();
    } catch (err) {
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    getIdoso();
    getMetricasValues();
    handleUser();
  }, []);

  return !user?.id ? (
    <NaoAutenticado />
  ) : (
    <View>
      <View style={styles.header}>
        <Pressable onPress={() => back()}>
          <Icon name="chevron-left" size={40} color="#fff" />
        </Pressable>
        <Text style={styles.textheader}>{params.categoria}</Text>
      </View>

      <View
        style={params.categoria === "IMC" ? styles.botoes : styles.botao}
      >
        {params.categoria === "IMC" && (
          <Pressable style={styles.botaoEditarMetricas} onPress={calcular}>
            <Icon name="plus" color={"white"} size={20} />
            <Text style={styles.textoBotaoEditarMetricas}>
              Calcular automaticamente
            </Text>
          </Pressable>
        )}
        {params.categoria === "HIDRATACAO" && (
          <Pressable style={styles.botaoAdicionarMeta} onPress={novaMeta}>
            <Text style={styles.textoBotaoAdicionarMeta}>Adicionar meta</Text>
          </Pressable>
        )}
        <Pressable style={styles.botaoEditarMetricas} onPress={novoValor}>
          <Icon name="plus" color={"white"} size={20} />
          <Text style={styles.textoBotaoEditarMetricas}>Novo valor</Text>
        </Pressable>
      </View>
      <View style={styles.valorMaximoHidratacao}>
        {params.categoria === "HIDRATACAO" && (
          <View>
            <View
              style={[
                styles.valorAtualCotainer,
                { borderColor: somaMeta >= Number(meta) ? "green" : "#000" },
              ]}
            >
              <Text
                style={[
                  styles.valorAtualTexto,
                  { color: somaMeta >= Number(meta) ? "green" : "#000" },
                ]}
              >{`${somaMeta} ml/${meta} ml`}</Text>
            </View>
          </View>
        )}
      </View>
      <FlatList
        data={valueMetrica}
        renderItem={({ item }) => (
          <Pressable>
            <CardValorMetrica
              item={item}
              metrica={params}
            />
          </Pressable>
        )}
      />

      {modalVisible && (
        <ModalMetrica
          visible={modalVisible}
          callbackFn={salvar}
          closeModal={() => setModalVisible(false)}
          metrica={params}
          message={params.categoria}
        />
      )}
      {modalMetaVisible && (
        <ModalMeta
          visible={modalMetaVisible}
          callbackFn={adicionarMeta}
          closeModal={() => setModalMetaVisible(false)}
          metrica={params}
          message={params.categoria}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2CCDB5",
    width: "100%",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  botaoEditarMetricas: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B4026D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 10,
  },

  botaoAdicionarMeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B4026D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 10,
    position: "absolute",
    left: 10,
  },

  textoBotaoEditarMetricas: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  textoBotaoAdicionarMeta: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
    padding: 3,
  },

  textheader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  botoes: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botao: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
  },
  valorMaximoHidratacao: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  valorAtualCotainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 15,
    opacity: 0.7,
  },
  valorAtualTexto: {
    fontSize: 25,
  },
  botaoLimpar: {
    alignItems: "center",
    marginTop: 10,
  },
  textoBotaoLimpar: {
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
