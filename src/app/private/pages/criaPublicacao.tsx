import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import CustomButton from "../../components/CustomButton";
import ErrorMessage from "../../components/ErrorMessage";

interface IErrors {
  titulo?: string;
  descricao?: string;
  categoria?: string;
}

export default function CriaPublicacao() {
  const [idUsuario, setIdUsuario] = useState<number>(0);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const getIdUsuario = async () => {
    const usuarioData = await AsyncStorage.getItem("usuario");
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      if (usuario?.id) {
        setIdUsuario(Number(usuario.id));
      } else {
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: "ID de usuário não encontrado no armazenamento.",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Usuário não encontrado no armazenamento.",
      });
    }
  };

  const data = [
    { key: "GERAL", value: "GERAL" },
    { key: "SAUDE", value: "SAUDE" },
    { key: "ALIMENTACAO", value: "ALIMENTACAO" },
    { key: "EXERCICIOS", value: "EXERCICIOS" },
  ];

  const publicar = async () => {
    try {
      handleErrors();

      if (Object.keys(erros).length > 0) {
        setShowErrors(true);
        return;
      }

      if (!idUsuario) {
        throw new Error("ID do usuário não está definido.");
      }

      const body = {
        idUsuario,
        titulo,
        descricao,
        dataHora: new Date(),
        categoria: categoria as string,
      };

      setLoading(true);

      // Simulação de publicação com sucesso
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Sucesso!",
          text2: "Publicação realizada com sucesso!",
        });
        router.push("/private/tabs/forum");
      }, 1000); // Simula um delay de publicação

    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      Toast.show({
        type: "error",
        text1: "Erro ao publicar!",
        text2: errMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => handleErrors(), [titulo, descricao, categoria]);
  useEffect(() => {
    const fetchUserData = async () => {
      await getIdUsuario();
    };
    fetchUserData();
  }, []);

  const handleErrors = () => {
    const erros: IErrors = {};

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

  return (
    <ScrollView>
      <View style={styles.header}>
        <Link href="private/tabs/forum">
          <Icon name="chevron-left" size={40} color="#fff" />
        </Link>

        <Text style={styles.tituloheader}>Nova publicação</Text>
      </View>

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
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.categoria} />
        </View>

        <View style={styles.botaoPublicar}>
          <CustomButton
            title="Publicar"
            callbackFn={publicar}
            showLoading={loading}
          />
        </View>
      </View>
    </ScrollView>
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
  botaoPublicar: {
    marginTop: 30,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
});
