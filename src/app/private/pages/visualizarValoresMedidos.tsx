import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NaoAutenticado from "../../components/NaoAutenticado";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function VisualizarValoresMedidos() {
  const [user, setUser] = useState(null); // Removido tipo IUser
  const [selectedMetric, setSelectedMetric] = useState<string | undefined>(
    undefined
  );
  const [hasData, setHasData] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleUser = async () => {
    try {
      const response = await AsyncStorage.getItem("usuario");
      const usuario = response ? JSON.parse(response) : null;
      setUser(usuario);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  useEffect(() => {
    handleUser();

    const loadSelectedMetric = async () => {
      try {
        const metric = await AsyncStorage.getItem("selectedMetric");
        setSelectedMetric(metric || "");
      } catch (error) {
        console.error("Erro ao carregar a métrica selecionada:", error);
      }
    };

    loadSelectedMetric();

    // Simulando a ausência de dados
    const temDados = false; // Ajustar conforme necessidade
    setHasData(temDados);
  }, []);

  const novoValor = () => {
    // Lógica para registrar um novo valor de métrica (exemplo: abrir formulário de inserção)
    console.log("Novo valor para métrica");
  };

  const apagarMetrica = async () => {
    try {
      await AsyncStorage.removeItem("selectedMetric"); // Apagar métrica selecionada
      setSelectedMetric(""); // Limpar o estado local
      console.log("Métrica apagada");
    } catch (error) {
      console.error("Erro ao apagar métrica:", error);
    }
  };

  return !user?.id ? (
    <NaoAutenticado />
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.iconContainer}
        >
          <Icon name="chevron-left" size={20} color="white" />
        </Pressable>
        <Text style={styles.headerText}>{selectedMetric || "Métrica"}</Text>
      </View>

      <Pressable style={styles.botaoNovoValor} onPress={novoValor}>
        <Icon name="plus" color={"white"} size={20} />
        <Text style={styles.textoBotaoNovoValor}>Novo Valor</Text>
      </Pressable>

      {hasData ? (
        <View>
          {/* Exibição dos dados cadastrados (adicionar componente para exibir os dados) */}
        </View>
      ) : (
        <Text style={styles.nenhumDado}>Nenhum dado cadastrado</Text>
      )}

      <Pressable style={styles.apagarMetrica} onPress={apagarMetrica}>
        <Text style={styles.textoApagarMetrica}>Apagar Métrica</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#2CCDB5",
    width: "100%",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  botaoNovoValor: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B4026D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: 10,
    marginVertical: 10,
  },

  textoBotaoNovoValor: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },

  nenhumDado: {
    color: "#D3D3D3",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },

  apagarMetrica: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
  },
  textoApagarMetrica: {
    color: "#FF7D7D",
    fontSize: 18,
    fontWeight: "400",
  },
});
