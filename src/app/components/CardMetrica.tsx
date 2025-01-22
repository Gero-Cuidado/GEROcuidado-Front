import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IProps {
  item: {
    id: string;
    categoria: string;
  };
}

export default function CardMetrica({ item }: IProps) {
  const [valorMetrica, setValorMetrica] = useState<number | undefined>(undefined);
  const [dataHora, setDataHora] = useState<string | undefined>(undefined);
  const [hora, setHora] = useState("");
  const [data, setData] = useState("");

  const titleColor = "#000";
  const textColor = "#888";

  const unidade = () => {
    const unidades: Record<string, string> = {
      "FREQ_CARDIACA": "bpm",
      "GLICEMIA": "mg/dL",
      "PESO": "kg",
      "PRESSAO_SANGUINEA": "mmHg",
      "SATURACAO_OXIGENIO": "%",
      "TEMPERATURA": "°C",
      "HORAS_DORMIDAS": "h",
      "ALTURA": "cm",
      "IMC": "kg/m²",
      "HIDRATACAO": "ml",
    };
    return unidades[item.categoria] || "";
  };

  const icone = () => {
    const icones: Record<string, JSX.Element> = {
      "FREQ_CARDIACA": <FontAwesome name="heartbeat" color={"#FF7D7D"} size={25} />,
      "GLICEMIA": <FontAwesome name="cubes" color={"#3F3F3F"} size={25} />,
      "PESO": <Icon name="scale-bathroom" color={"#B4026D"} size={25} />,
      "PRESSAO_SANGUINEA": <FontAwesome name="tint" color={"#FF7D7D"} size={25} />,
      "SATURACAO_OXIGENIO": (
        <View>
          <Text>
            O<Text style={{ fontSize: 10 }}>2</Text>
          </Text>
        </View>
      ),
      "TEMPERATURA": <FontAwesome name="thermometer" color={"#FFAC7D"} size={25} />,
      "HORAS_DORMIDAS": <FontAwesome name="bed" color={"#4B0082"} size={25} />,
      "ALTURA": <Entypo name="ruler" color={"#000"} size={25} style={{ opacity: 0.8 }} />,
      "IMC": <Entypo name="calculator" color={"#000"} size={25} />,
      "HIDRATACAO": <MaterialCommunityIcons name="cup-water" color={"#1075c8"} size={25} />,
    };
    return icones[item.categoria] || null;
  };

  const getMetricas = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(`metrica_${item.id}`);
      if (storedValue) {
        const { valor, dataHora } = JSON.parse(storedValue);
        setValorMetrica(valor);
        setDataHora(dataHora);
      } else {
        setValorMetrica(undefined);
        setDataHora(undefined);
      }
    } catch (err) {
      console.error("Erro ao buscar valor de métrica:", err);
    }
  };

  const separaDataHora = () => {
    if (!dataHora) return;

    const date = new Date(dataHora);
    const [year, month, day] = date.toISOString().split("T")[0].split("-");
    const [hour, minute] = date.toISOString().split("T")[1].split(":");
    setHora(`${hour}:${minute}`);
    setData(`${day}/${month}/${year}`);
  };

  useEffect(() => {
    getMetricas();
  }, [item]);

  useEffect(() => {
    separaDataHora();
  }, [dataHora]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          <Text style={[styles.title, { color: titleColor }]}>
            {item.categoria}
          </Text>
        </View>
        <Text style={styles.content}>
          {valorMetrica !== undefined ? (
            <>
              <Text style={[styles.number]}>{valorMetrica}</Text>
              <Text style={[styles.units, { color: textColor }]}>
                {unidade()}
              </Text>
            </>
          ) : (
            <Text style={[styles.units, { color: textColor }]}>
              Nenhum valor cadastrado
            </Text>
          )}
        </Text>
        {dataHora && (
          <Text style={[styles.time, { color: textColor }]}>
            {data} às {hora}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
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
    width: 170,
    height: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
  },
  content: {
    fontSize: 14,
    marginTop: 8,
  },
  number: {
    fontWeight: "bold",
    fontSize: 24,
  },
  units: {
    marginLeft: 3,
    fontSize: 18,
  },
  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 8,
  },
  chevron: {
    top: 10,
    left: "85%",
    position: "absolute",
  },
  othersIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  oxygenIcon: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
