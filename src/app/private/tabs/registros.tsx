import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NaoAutenticado from "../../components/NaoAutenticado";
import IdosoNaoSelecionado from "../../components/IdosoNaoSelecionado";
import CardMetrica from "../../components/CardMetrica";
import { router } from "expo-router";
import { getFoto } from "../../shared/helpers/photo.helper";

export default function Registros() {
  const [user, setUser] = useState<any | undefined>(undefined);  // Removido o tipo IUser
  const [idoso, setIdoso] = useState<any | undefined>(undefined);  // Removido o tipo IIdoso
  const [metricas, setMetricas] = useState<any[]>([]);  // Removido o tipo IMetrica
  const [loading, setLoading] = useState(true);

  const handleUser = () => {
    AsyncStorage.getItem("usuario").then((response) => {
      const usuario = JSON.parse(response as string);
      setUser(usuario);
    });
  };

  const getIdoso = () => {
    AsyncStorage.getItem("idoso").then((idosoString) => {
      if (!idosoString) {
        console.error("Nenhum idoso encontrado no AsyncStorage.");
        return;
      }
      try {
        const idosoPayload = JSON.parse(idosoString);
        setIdoso(idosoPayload);
      } catch (error) {
        console.error("Erro ao parsear idoso do AsyncStorage:", error);
      }
    });
  };

  const visualizarMetrica = (item: any) => {
    router.push({
      pathname: "private/pages/visualizarMetrica",
      params: {
        id: item.id,
        idIdoso: item.idIdoso,
        categoria: item.categoria,
        valorMaximo: item.valorMaximo,
      },
    });
  };

  const getMetricas = async () => {
    if (!idoso) return;

    try {
      setLoading(true);
      const storedMetricas = await AsyncStorage.getItem("metricas");
      const metricasData = storedMetricas ? JSON.parse(storedMetricas) : [];
      const idosoMetricas = metricasData.filter(
        (metrica: any) => metrica.idIdoso === idoso.id
      );

      setMetricas(idosoMetricas);
    } catch (err) {
      console.log("Erro ao obter métricas do idoso:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => handleUser(), []);
  useEffect(() => getIdoso(), []);
  useEffect(() => { getMetricas() }, [idoso]);

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

      <View style={styles.verMetrica}>
        <FlatList
          data={metricas}
          numColumns={2}
          renderItem={({ item }) => (
            <Pressable onPress={() => visualizarMetrica(item)}>
              <CardMetrica item={item} />
            </Pressable>
          )}
        />
      </View>
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
    alignSelf: "center",
    width: "100%",
    height: Dimensions.get("window").height - 230,
    justifyContent: "space-between",
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
