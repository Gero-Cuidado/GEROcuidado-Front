import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "../../interfaces/user.interface";
import NaoAutenticado from "../../components/NaoAutenticado";
import { IIdoso } from "../../interfaces/idoso.interface";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IdosoNaoSelecionado from "../../components/IdosoNaoSelecionado";
import CardMetrica from "../../components/CardMetrica";
import { FlatList } from "react-native-gesture-handler";
import {
  EMetricas,
  IMetrica,
  IMetricaFilter,
  IValorMetrica,
} from "../../interfaces/metricas.interface";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { getAllMetrica } from "../../services/metrica.service";
import Toast from "react-native-toast-message";
import GridView from 'react-native-draggable-gridview'

export default function Registros() {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [idoso, setIdoso] = useState<IIdoso>();
  const [metricas, setMetricas] = useState<IMetrica[]>([]);
  const [loading, setLoading] = useState(true);
  const handleUser = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string);
      setUser(usuario);
    });
  };

  const getIdoso = () => {
    AsyncStorage.getItem("idoso").then((idosoString) => {
      if (idosoString) {
        const idosoPayload = JSON.parse(idosoString) as IIdoso;
        setIdoso(idosoPayload);
      }
    });
  };

  const hasFoto = (foto: string | null | undefined) => {
    if (!foto) return false;

    const raw = foto.split("data:image/png;base64,")[1];
    return raw.length > 0;
  };

  const getFoto = (foto: string | null | undefined) => {
    if (hasFoto(foto)) {
      return (
        <Image source={{ uri: foto as string }} style={styles.fotoPerfil} />
      );
    }

    return (
      <View style={[styles.semFoto, styles.fotoPerfil]}>
        <Icon style={styles.semFotoIcon} name="image-outline" size={15} />
      </View>
    );
  };

  // const novaMetrica = () => {
  //   router.push("private/pages/cadastrarMetrica");
  // };

  const visualizarMetrica = (item: IMetrica) => {
    router.push({
      pathname: "private/pages/visualizarMetrica",
      params: item,
    });
  };

  const getMetricas = () => {
    if (idoso == undefined) return;

    setLoading(true);

    const metricaFilter: IMetricaFilter = {
      idIdoso: Number(idoso.id),
    };

    getAllMetrica(metricaFilter)
      .then((response) => {
        const newMetricas = response.data as IMetrica[];
        setMetricas(newMetricas);
      })
      .catch((err) => {
        const error = err as { message: string };
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => handleUser(), []);
  useEffect(() => getIdoso(), []);
  useEffect(() => getMetricas(), [idoso]);

  return (
    <>
      {!user?.id && <NaoAutenticado />}
      {user?.id && !idoso?.id && <IdosoNaoSelecionado />}

      {user?.id && idoso?.id && (
        <View style={styles.header}>
          {getFoto(idoso?.foto)}
          <Text style={styles.nomeUsuario}>
            <Text style={styles.negrito}>{idoso?.nome}</Text>
          </Text>
        </View>
      )}

      {/* <View>
        <Pressable style={styles.botaoCriarMetricas} onPress={novaMetrica}>
          <Icon name="plus" color={"white"} size={20} />
          <Text style={styles.textoBotaoCriarMetricas}>Nova Métrica</Text>
        </Pressable>
      </View> */}
      <ScrollView>
        <GridView
          data={metricas}
          numColumns={2}
          renderItem={(item) => (
            <View style={styles.verMetrica}>
              <CardMetrica item={item} />
            </View>
          )}
          onPressCell={(item) => visualizarMetrica(item)}
          onReleaseCell={(items) => setMetricas(items)}
          />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2CCDB5",
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  verMetrica: {
    alignSelf:"center",
    width: "80%",
  },

  fotoPerfil: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 100,
  },
  semFoto: { position: "relative", backgroundColor: "#EFEFF0" },
  semFotoIcon: {
    position: "absolute",
    right: "38%",
    bottom: "38%",
    opacity: 0.4,
    margin: "auto",
    alignSelf: "center",
    zIndex: 1,
  },
  nomeUsuario: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 20,
    maxWidth: "75%",
  },
  negrito: {
    fontWeight: "bold",
  },
  cardMetrica: {
    width: "40%",
    margin: 10,
  },
  list: {
    width: "100%",
  },
  botaoCriarMetricas: {
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
  textoBotaoCriarMetricas: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
});
