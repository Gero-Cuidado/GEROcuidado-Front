import React, { useEffect, useState } from "react";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesing from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface IPublicacao {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  dataHora: string | Date;
  usuario?: {
    nome?: string;
    foto?: string | null;
  };
  idUsuarioReporte?: string[];
}

interface IProps {
  item: IPublicacao;
  crop?: boolean;
}

export default function Publicacao({ item, crop }: Readonly<IProps>) {
  const router = useRouter();
  const [publicacao, setPublicacao] = useState<IPublicacao | null>(null);

  useEffect(() => {
    const fetchPublicacao = async () => {
      try {
        const data = await AsyncStorage.getItem(item.id);
        if (data) {
          setPublicacao(JSON.parse(data));
        }
      } catch (error) {
        console.error("Erro ao buscar publicação no AsyncStorage:", error);
      }
    };
    fetchPublicacao();
  }, [item.id]);

  const getFoto = (foto: string | null | undefined) => {
    if (foto) {
      return (
        <Image source={{ uri: foto as string }} style={styles.fotoPerfil} />
      );
    }

    return (
      <View style={[styles.semFoto, styles.fotoPerfil]}>
        <Icon
          style={styles.semFotoIcon}
          name="image-outline"
          size={15}
          testID="placeholder-icon"
        />
      </View>
    );
  };

  const getFormattedDate = (payload: Date | string): string => {
    const date = new Date(payload);
    return date.toLocaleDateString("pt-BR");
  };

  const navigate = async () => {
    try {
      // Converte o dataHora para string e o objeto usuario para JSON
      const formattedParams = {
        id: item.id,
        titulo: item.titulo,
        descricao: item.descricao,
        categoria: item.categoria,
        dataHora: new Date(item.dataHora).toLocaleString(),
        usuario: JSON.stringify(item.usuario),  // Convertendo o objeto usuario para string
      };
  
      // Salva os dados no AsyncStorage
      await AsyncStorage.setItem(item.id, JSON.stringify(item));
  
      // Navega para a página de detalhes da publicação
      router.push({
        pathname: "/private/pages/visualizarPublicacao",
        params: formattedParams,
      });
    } catch (error) {
      console.error("Erro ao salvar publicação ou navegar:", error);
    }
  };
  
  

  const getNome = (nome?: string): string => {
    if (!nome) return "Usuário deletado";
    if (!crop) return nome;

    return nome.length < 25 ? nome : nome.slice(0, 25) + "...";
  };

  const getTitulo = (titulo: string): string => {
    if (!crop) return titulo;

    return titulo.length < 30 ? titulo : titulo.slice(0, 30) + "...";
  };

  const getDescricao = (descricao: string): string => {
    if (!crop) return descricao;

    return descricao.length < 150 ? descricao : descricao.slice(0, 150) + "...";
  };

  if (!publicacao) {
    return null; // Pode adicionar um spinner ou placeholder aqui
  }

  return (
    <Pressable onPress={navigate} style={styles.postContainer}>
      <View style={styles.postHeader}>
        {getFoto(publicacao.usuario?.foto)}
        <View style={styles.userInfo}>
          <Text style={styles.title}>{getTitulo(publicacao.titulo)}</Text>
          <Text style={styles.categoria}>{publicacao.categoria}</Text>
          <View style={styles.subInfo}>
            <Text style={styles.username}>
              {getNome(publicacao.usuario?.nome)}
            </Text>
            <Text style={styles.date}>
              {getFormattedDate(publicacao.dataHora)}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.postContent}>
        {getDescricao(publicacao.descricao)}
      </Text>
      <View style={styles.underInfo}>
        {publicacao.idUsuarioReporte &&
          publicacao.idUsuarioReporte.length > 0 && (
            <View style={styles.reports}>
              <AntDesing name="warning" size={18} color="#FFCC00" />
              <Text style={styles.reportsText}>Usuários reportaram</Text>
            </View>
          )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    margin: 10,
    borderRadius: 14,
    elevation: 5,
    backgroundColor: "white",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    height: "auto",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  userInfo: {
    marginLeft: 10,
    width: "100%",
  },
  subInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  categoria: {
    opacity: 0.5,
    marginTop: 5,
  },
  date: {
    color: "#000000",
    opacity: 0.5,
    fontSize: 10,
    marginLeft: 10,
  },
  postContent: {
    fontSize: 16,
    marginTop: 15,
  },
  fotoPerfil: {
    width: 45,
    aspectRatio: 1,
    borderRadius: 100,
  },
  semFoto: { position: "relative", backgroundColor: "#EFEFF0" },
  semFotoIcon: {
    position: "absolute",
    right: "34%",
    bottom: "34%",
    opacity: 0.4,
    margin: "auto",
    alignSelf: "center",
    zIndex: 1,
  },
  username: {
    color: "#000000",
    opacity: 0.5,
    fontSize: 13,
  },
  underInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 10,
  },
  reports: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportsText: {
    color: "#FFCC00",
    marginLeft: 3,
  },
});
