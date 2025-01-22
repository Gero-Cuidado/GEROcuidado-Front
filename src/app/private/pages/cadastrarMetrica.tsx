import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";


export default function CriarMetrica() {
  const [idoso, setIdoso] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usuario = await AsyncStorage.getItem("usuario");
        const idosoInfo = await AsyncStorage.getItem("idoso");
        setUser(usuario ? JSON.parse(usuario) : null);
        setIdoso(idosoInfo ? JSON.parse(idosoInfo) : null);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  const handleMetricSelection = async (metricType) => {
    if (!idoso) {
      alert("Idoso não encontrado. Por favor, tente novamente mais tarde.");
      return;
    }

    const metric = {
      idIdoso: idoso.id,
      categoria: metricType,
    };

    try {
      const metrics = await AsyncStorage.getItem("metricas");
      const metricas = metrics ? JSON.parse(metrics) : [];
      metricas.push(metric);
      await AsyncStorage.setItem("metricas", JSON.stringify(metricas));
      alert("Métrica cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a métrica:", error);
    }
  };

  const renderMetricCard = (metricType, iconName, description, iconColor) => (
    <Pressable
      key={metricType}
      style={styles.metricCard}
      onPress={() => handleMetricSelection(metricType)}
    >
      <View style={styles.metricCardContent}>
        {iconName === "oxygen" && <Text style={styles.oxygenSymbol}>O2</Text>}
        {iconName !== "oxygen" && (
          <Icon
            name={iconName}
            color={iconColor}
            size={30}
            style={styles.metricCardIcon}
          />
        )}
        <View style={styles.metricsName}>
          <Text style={styles.metricCardText}>{description}</Text>
          <Text style={styles.cadastrarPlaceholder}>
            Cadastrar {description}
          </Text>
        </View>
        <Icon name="chevron-right" color={"#888"} />
      </View>
    </Pressable>
  );

  const metricData = [
    { type: "FREQ_CARDIACA", icon: "heartbeat", desc: "Frequência Cardíaca", color: "#FF7D7D" },
    { type: "PRESSAO_SANGUINEA", icon: "tint", desc: "Pressão Sanguínea", color: "#FF7D7D" },
    { type: "SATURACAO_OXIGENIO", icon: "oxygen", desc: "Saturação do Oxigênio", color: "#87F4E4" },
    { type: "TEMPERATURA", icon: "thermometer", desc: "Temperatura", color: "#FFAC7D" },
    { type: "GLICEMIA", icon: "cubes", desc: "Glicemia", color: "#3F3F3F" },
    { type: "ALTURA", icon: "user", desc: "Altura (m)", color: "#3F3F3F" },
    { type: "PESO", icon: "balance-scale", desc: "Peso (kg)", color: "#000000" },
    { type: "HORAS_DORMIDAS", icon: "bed", desc: "Horas Dormidas", color: "#3F3F3F" },
    { type: "HIDRATACAO", icon: "cup-water", desc: "Hidratação", color: "#1075c8" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.botaoCriarMetricas} onPress={() => alert("Voltar")}>
          <Icon name="chevron-left" color={"black"} size={20} style={styles.chevronLeft} />
        </Pressable>
        <View style={styles.photoAndName}>
          {idoso && (
            <>
              <Text style={styles.nomeUsuario}>
                <Text style={styles.negrito}>{idoso.nome}</Text>
              </Text>
            </>
          )}
        </View>
      </View>
      <Text style={styles.textoAbaixoDoBotao}>
        <Text style={styles.text}>Selecione a métrica a ser cadastrada</Text>
      </Text>
      <View style={styles.metricCardsContainer}>
        {metricData.map((metric) =>
          renderMetricCard(metric.type, metric.icon, metric.desc, metric.color)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    backgroundColor: "#2CCDB5",
  },
  photoAndName: {
    padding: 10,
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center",
  },
  none: { width: 30 }, // necessário para alinhar a foto, NÃO REMOVA
  fotoPerfil: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 100,
  },
  semFoto: { position: "relative", backgroundColor: "#EFEFF0" },
  semFotoIcon: {
    opacity: 0.4,
    margin: "auto",
    alignSelf: "center",
  },
  nomeUsuario: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
    maxWidth: "100%",
  },
  container: {
    flexGrow: 1,
  },
  botaoCriarMetricas: {},
  chevronLeft: {
    marginLeft: 15,
    width: 15,
  },
  textoBotaoCriarMetricas: {
    color: "#3F3F3F",
    fontSize: 17,
    marginLeft: 15,
  },
  textoAbaixoDoBotao: {
    marginTop: 30,
    textAlign: "center",
    color: "#3F3F3F",
    fontSize: 20,
  },
  metricCardsContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  metricCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  metricCardIcon: {
    marginRight: 10,
  },
  metricCardText: {
    color: "#3F3F3F",
    fontSize: 16,
  },
  metricsName: {
    flexDirection: "column",
    alignItems: "center",
  },
  imagem: {
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  metricCardContent: {
    flex: 1,
    flexDirection: "row",
    //alignItems: "center",
    justifyContent: "space-between",
  },
  cadastrarPlaceholder: {
    color: "#A9A9A9",
    fontSize: 12,
    marginTop: 5,
  },
  oxygenSymbol: {
    fontSize: 30,
    color: "#3F3F3F",
    marginRight: 10,
  },
  negrito: {
    fontWeight: "bold",
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});
