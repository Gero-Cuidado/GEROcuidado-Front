import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface IProps {
  item: {
    id: string;
    titulo: string;
    categoria: string;
    dias: string[];
    dataHora: string;
    descricao: string;
    dataHoraConcluidos: string[];
  };
  index: number;
  date: Date;
}

export default function CardRotina({ item, index, date }: IProps) {
  const dateString = date.toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [nameIcon, setNameIcon] = useState("view-grid-outline");
  const [check, setCheck] = useState(false);
  const [time, setTime] = useState("");

  const handleIcon = () => {
    switch (item.categoria) {
      case "ALIMENTACAO":
        setNameIcon("food-apple-outline");
        break;
      case "EXERCICIOS":
        setNameIcon("dumbbell");
        break;
      case "MEDICAMENTO":
        setNameIcon("medical-bag");
        break;
      default:
        setNameIcon("view-grid-outline");
    }
  };

  const debounceConcluido = async (concluido: boolean) => {
    setCheck(concluido);
    let updatedDataHoraConcluidos = [];

    if (concluido) {
      updatedDataHoraConcluidos = [...item.dataHoraConcluidos, dateString];
    } else {
      updatedDataHoraConcluidos = item.dataHoraConcluidos.filter(
        (data) => data !== dateString
      );
    }

    try {
      const storedData = await AsyncStorage.getItem("rotinas");
      const rotinas = storedData ? JSON.parse(storedData) : [];
      const updatedRotinas = rotinas.map((rotina: any) =>
        rotina.id === item.id
          ? { ...rotina, dataHoraConcluidos: updatedDataHoraConcluidos }
          : rotina
      );
      await AsyncStorage.setItem("rotinas", JSON.stringify(updatedRotinas));
    } catch (error) {
      console.error("Erro ao salvar rotina:", error);
    }
  };

  const navigate = async () => {
    try {
      const formattedParams = {
        id: item.id,
        titulo: item.titulo,
        descricao: item.descricao,
        categoria: item.categoria,
        dataHora: new Date(item.dataHora).toLocaleString(),
        dataHoraConcluidos: JSON.stringify(item.dataHoraConcluidos),
      };

      // Salva os dados no AsyncStorage
      await AsyncStorage.setItem(item.id, JSON.stringify(item));

      // Navega para a página de edição da rotina
      router.push({
        pathname: "/private/pages/editarRotina",
        params: formattedParams,
      });
    } catch (error) {
      console.error("Erro ao salvar rotina ou navegar:", error);
    }
  };

  const handleDataHora = () => {
    const dateString = new Date(item.dataHora).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const [data, hora] = dateString.split(" ");
    setCheck(item.dataHoraConcluidos.includes(data));
    setTime(hora);
  };

  useEffect(() => handleIcon(), []);
  useEffect(() => handleDataHora(), []);

  return (
    <>
      <Text style={styles.hora}>{time}</Text>
      <Pressable
        onPress={navigate}
        style={[
          styles.container,
          { backgroundColor: index % 2 === 0 ? "#B4FFE8" : "#FFC6C6" },
        ]}
      >
        <View style={styles.icon}>
          <Icon size={30} name={nameIcon}></Icon>
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.description}>{item.descricao}</Text>
        </View>
        <Pressable
          onPress={() => debounceConcluido(!check)}
          style={styles.checkBox}
          testID="checkbox"
        >
          {check && <Icon name="check" size={30} testID="check-icon"></Icon>}
        </Pressable>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  hora: {
    fontSize: 18,
    fontWeight: "300",
    marginLeft: 20,
    marginTop: 10,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width - 40,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 4,
    padding: 10,
    paddingVertical: 5,
  },
  texts: {
    flexDirection: "column",
    marginLeft: 10,
    marginBottom: 8,
    marginTop: 8,
    marginRight: 8,
    flex: 1,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
  },
  description: {
    color: "#767676",
    marginTop: 10,
  },
  icon: {},
  checkBox: {
    height: 30,
    width: 30,
    borderRadius: 5,
    backgroundColor: "white",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
