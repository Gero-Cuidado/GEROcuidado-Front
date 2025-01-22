import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Entypo, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalConfirmation from "./ModalConfirmation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IProps {
  item: {
    id: string;
    categoria: string;
    valor: number;
    dataHora: string;
  };
  metrica: {
    id: string;
    titulo: string;
    descricao: string;
  };
}

export default function CardValorMetrica({ item, metrica }: IProps) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const titleColor = "#000";
  const textColor = "#888";

  const unidade = () => {
    const unitsMap: { [key: string]: string } = {
      FREQ_CARDIACA: "bpm",
      GLICEMIA: "mg/dL",
      PESO: "kg",
      PRESSAO_SANGUINEA: "mmHg",
      SATURACAO_OXIGENIO: "%",
      TEMPERATURA: "°C",
      ALTURA: "cm",
      HORAS_DORMIDAS: "h",
      IMC: "kg/m²",
      HIDRATACAO: "ml",
    };
    return unitsMap[item.categoria] || "";
  };

  const separaDataHora = () => {
    const dataHoraNum = new Date(item.dataHora).getTime();
    const fuso = new Date(item.dataHora).getTimezoneOffset() * 60000;
    const value = new Date(dataHoraNum - fuso).toISOString();
    const [date, time] = value.split("T");
    const [year, month, day] = date.split("-");
    setData(`${day}/${month}/${year}`);
    setHora(time.split(":").slice(0, 2).join(":"));
  };

  const icone = () => {
    const iconMap: { [key: string]: JSX.Element } = {
      FREQ_CARDIACA: <FontAwesome name="heartbeat" color="#FF7D7D" size={25} />,
      GLICEMIA: <FontAwesome name="cubes" color="#3F3F3F" size={25} />,
      PESO: <Icon name="scale-bathroom" color="#B4026D" size={25} />,
      PRESSAO_SANGUINEA: <FontAwesome name="tint" color="#FF7D7D" size={25} />,
      SATURACAO_OXIGENIO: (
        <Text>
          O<Text style={{ fontSize: 10 }}>2</Text>
        </Text>
      ),
      TEMPERATURA: <FontAwesome name="thermometer" color="#FFAC7D" size={25} />,
      HORAS_DORMIDAS: <FontAwesome name="bed" color="#4B0082" size={25} />,
      ALTURA: <Entypo name="ruler" color="#000" size={25} style={{ opacity: 0.8 }} />,
      IMC: <Entypo name="calculator" color="#000" size={25} />,
      HIDRATACAO: <MaterialCommunityIcons name="cup-water" color="#1075c8" size={25} />,
    };
    return iconMap[item.categoria] || null;
  };

  const apagarValor = async () => {
    try {
      setModalVisible(false);

      // Recupera os registros do AsyncStorage
      const storedData = await AsyncStorage.getItem("valoresMetrica");
      const valores = storedData ? JSON.parse(storedData) : [];

      // Filtra o valor que será excluído
      const updatedValores = valores.filter((valor: any) => valor.id !== item.id);

      // Salva novamente no AsyncStorage
      await AsyncStorage.setItem("valoresMetrica", JSON.stringify(updatedValores));

      // Navega para a página de detalhes da métrica
      router.replace({
        pathname: "/private/pages/visualizarMetrica",
        params: metrica,
      });
    } catch (error) {
      console.error("Erro ao apagar valor de métrica:", error);
    }
  };

  const confirmation = () => setModalVisible(!modalVisible);

  const closeModal = () => setModalVisible(false);

  useEffect(() => separaDataHora(), []);

  return (
    <View style={styles.container}>
      <View
        style={[styles.card, { borderColor: "#ddd", backgroundColor: "#fff" }]}
      >
        <View
          style={
            item.categoria === "SATURACAO_OXIGENIO"
              ? styles.oxygenIcon
              : styles.othersIcons
          }
        >
          {icone()}
          <Text style={[styles.title, { color: titleColor }]}>{item.valor}</Text>
          <Text style={[styles.units, { color: textColor }]}>{unidade()}</Text>
        </View>
        <Octicons
          name="x-circle-fill"
          style={styles.apagar}
          size={22}
          color="#FF7F7F"
          onPress={confirmation}
        />
        <ModalConfirmation
          visible={modalVisible}
          callbackFn={apagarValor}
          closeModal={closeModal}
          message={`Apagar registro ${item.categoria}?`}
          messageButton="Apagar"
        />
        <View style={styles.dataHora}>
          <Text style={[styles.time, { color: textColor }]}>{data}</Text>
          <Text style={[styles.time, { color: textColor }]}>{hora}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    alignSelf: "center",
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 8,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    marginLeft: 8,
  },
  number: {
    fontWeight: "bold",
    fontSize: 24,
  },
  units: {
    marginTop: 5,
    marginLeft: 3,
    fontSize: 18,
  },
  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 8,
  },
  othersIcons: {
    flexDirection: "row",
  },
  oxygenIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataHora: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  apagar: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 0,
  },
});
