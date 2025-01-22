import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Platform,
  StyleSheet
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import CustomButton from "../../components/CustomButton";
import ErrorMessage from "../../components/ErrorMessage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function EditarPublicacao() {
  const item = useLocalSearchParams();

  const [titulo, setTitulo] = useState(item?.titulo || "");
  const [descricao, setDescricao] = useState(item?.descricao || "");
  const [categoria, setCategoria] = useState(item?.categoria || "");
  const [erros, setErros] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleErrors = () => {
    const erros = {};

    if (!titulo) {
      erros.titulo = "Campo obrigatório!";
    } else if (titulo.length > 100) {
      erros.titulo = "Deve ter no máximo 100 caracteres!";
    }

    if (!descricao) {
      erros.descricao = "Campo Obrigatório!";
    } else if (descricao.length > 500) {
      erros.descricao = "Deve ter no máximo 500 caracteres!";
    }

    if (!categoria) {
      erros.categoria = "Campo Obrigatório!";
    }

    setErros(erros);
  };

  const salvar = async () => {
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }

    const body = {
      titulo,
      descricao,
      categoria,
    };

    try {
      setShowLoading(true);
      // Simulando o comportamento do back-end com AsyncStorage
      const publicacoes = await AsyncStorage.getItem("publicacoes");
      const parsedPublicacoes = publicacoes ? JSON.parse(publicacoes) : [];
      const updatedPublicacoes = parsedPublicacoes.map((pub) =>
        pub.id === item.id ? { ...pub, ...body } : pub
      );

      await AsyncStorage.setItem("publicacoes", JSON.stringify(updatedPublicacoes));

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Publicação atualizada com sucesso.",
      });
      router.push("/private/tabs/forum");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Erro ao salvar a publicação.",
      });
    } finally {
      setShowLoading(false);
    }
  };

  const goBack = () => {
    router.push({
      pathname: "/private/pages/visualizarPublicacao",
      params: item,
    });
  };

  useEffect(() => {
    handleErrors();
  }, [titulo, descricao, categoria]);

  const data = [
    { key: "GERAL", value: "Geral" },
    { key: "SAUDE", value: "Saúde" },
    { key: "ALIMENTACAO", value: "Alimentação" },
    { key: "EXERCICIOS", value: "Exercícios" },
  ];

  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={goBack}>
          <Icon
            name="chevron-left"
            size={40}
            color="#fff"
            style={{ marginRight: 10 }}
          />
        </Pressable>

        <Text style={styles.tituloheader}>Editar publicação</Text>
      </View>

      <ScrollView>
        <View style={styles.publicacao}>
          <View style={styles.formControl}>
            <Text style={styles.inputLabel}>Título</Text>
            <TextInput
              onChangeText={setTitulo}
              value={titulo}
              placeholder="Título"
              style={styles.input}
            />
            <ErrorMessage show={showErrors} text={erros.titulo} />
          </View>

          <View style={styles.formControl}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              onChangeText={setDescricao}
              value={descricao}
              multiline={true}
              placeholder="Descrição"
              numberOfLines={Platform.OS === "ios" ? undefined : 12}
              style={[
                styles.input,
                { minHeight: Platform.OS === "ios" && 12 ? 20 * 12 : null },
              ]}
            />
            <ErrorMessage show={showErrors} text={erros.descricao} />
          </View>

          <View style={styles.formControl}>
            <View style={styles.selectInput}>
              <SelectList
                data={data}
                setSelected={setCategoria}
                placeholder="Categoria"
                search={false}
                defaultOption={{ key: item.categoria, value: item.categoria }}
              />
            </View>
            <ErrorMessage show={showErrors} text={erros.categoria} />
          </View>

          <View style={styles.linkButton}>
            <CustomButton
              title="Salvar"
              callbackFn={salvar}
              showLoading={showLoading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2CCDB5",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  tituloheader: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  publicacao: {
    borderRadius: 15,
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  formControl: {
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 10,
    fontWeight: "700",
  },
  input: {
    textAlignVertical: "top",
    borderWidth: 0,
    padding: 12,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    marginBottom: 5,
  },
  selectInput: {
    marginBottom: 5,
  },
  botaoSalvar: {
    marginTop: 30,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  apagar: {
    color: "#FF7F7F",
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "600",
    margin: 20,
  },
  linkButton: {
    alignItems: "center",
  },
});
