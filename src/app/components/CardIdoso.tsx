import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para simular a recuperação da foto, se houver uma ou uma imagem padrão
const getImageUri = (foto: string | undefined): string => {
  return foto ? foto : "default-image-uri"; // Troque por uma URL de imagem padrão se necessário
};

// Função auxiliar para retornar o nome do idoso com truncamento
const getNome = (nome: string): string => {
  return nome.length < 15 ? nome : nome.slice(0, 15) + "...";
};

export default function CardIdoso({ item }: { item: { id: number, nome: string, foto: string } }) {
  
  // Função para salvar o idoso selecionado no AsyncStorage e navegar para outra tela
  const selectIdoso = async () => {
    await AsyncStorage.setItem("idoso", JSON.stringify(item)); // Salvando o idoso no AsyncStorage
    router.replace("private/tabs/rotinas"); // Redireciona para a tela de rotinas
  };

  // Função para navegar para a tela de editar idoso
  const navigate = () => {
    const params = { ...item, id: item.id, foto: getImageUri(item.foto) };
    router.push({
      pathname: "/private/pages/editarIdoso",
      params: params,
    });
  };

  return (
    <View>
      <Pressable
        style={styles.idoso}
        onPress={selectIdoso}
        testID="cardIdosoPressable"
      >
        <View>
          <Image
            source={{ uri: item.foto }}
            style={styles.imagem}
            placeholder={{ uri: "default-image-uri" }} // Imagem padrão se não houver foto
            transition={500}
          />
        </View>
        <Text style={styles.texto}>{getNome(item.nome)}</Text>
        <Pressable
          style={styles.pencil}
          onPress={navigate}
          testID="pencil-icon"
        >
          <Icon
            style={styles.pencilIcon}
            name="pencil-outline"
            size={20}
            color={"white"}
          />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  imagem: {
    height: 149,
    aspectRatio: 1,
    borderRadius: 12,
  },
  texto: {
    alignSelf: "center",
    marginTop: 10,
  },
  pencil: {
    position: "absolute",
    right: -5,
    bottom: 12,
    backgroundColor: "#2CCDB5",
    borderRadius: 20,
    width: 28,
    height: 28,
    alignContent: "center",
    alignItems: "center",
  },
  pencilIcon: {
    marginTop: 3,
  },
  idoso: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
  },
});
