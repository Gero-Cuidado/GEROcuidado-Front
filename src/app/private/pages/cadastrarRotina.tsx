import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SelectList } from "react-native-dropdown-select-list";
import WeekDays from "../../components/weekDay";
import Calendar from "react-native-vector-icons/Feather";
import CustomButton from "../../components/CustomButton";
import MaskInput, { Masks } from "react-native-mask-input";
import MaskHour from "../../components/MaskHour";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorMessage from "../../components/ErrorMessage";

const categorias = [
  { key: "GERAL", value: "Geral" },
  { key: "MEDICAMENTO", value: "Medicamento" },
  { key: "ALIMENTACAO", value: "Alimentação" },
  { key: "EXERCICIOS", value: "Exercícios" },
];

interface IErrors {
  titulo?: string;
  data?: string;
  hora?: string;
  categoria?: string;
  descricao?: string;
}

export default function CadastrarRotina() {
  const getInitialDateTime = (isData = true) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDateArray = formattedDate.split(" ");
    return isData ? formattedDateArray[0] : formattedDateArray[1];
  };

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState(getInitialDateTime());
  const [hora, setHora] = useState(getInitialDateTime(false));
  const [notificacao, setNotificacao] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [dias, setDias] = useState<number[]>([]);

  const handleErrors = () => {
    const errors: IErrors = {};
    if (!titulo) errors.titulo = "O título é obrigatório.";
    if (!data) errors.data = "A data é obrigatória.";
    if (!hora) errors.hora = "A hora é obrigatória.";
    if (!categoria) errors.categoria = "A categoria é obrigatória.";
    if (!descricao) errors.descricao = "A descrição é obrigatória.";
    setErros(errors);
  };

  const salvar = async () => {
    handleErrors();
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }

    try {
      setShowLoading(true);
      const rotina = {
        titulo,
        data,
        hora,
        notificacao,
        descricao,
        categoria,
        dias,
      };
      const rotinas = JSON.parse((await AsyncStorage.getItem("rotinas")) || "[]");
      rotinas.push(rotina);
      await AsyncStorage.setItem("rotinas", JSON.stringify(rotinas));
      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Rotina criada com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao salvar a rotina:", err);
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Algo deu errado ao salvar a rotina.",
      });
    } finally {
      setShowLoading(false);
    }
  };

  const setSuggestedTitle = () => {
    switch (categoria) {
      case "ALIMENTACAO":
        setTitulo("Se Alimentar");
        break;
      case "MEDICAMENTO":
        setTitulo("Tomar Medicamento");
        break;
      case "EXERCICIOS":
        setTitulo("Fazer Exercício");
        break;
      default:
        break;
    }
  };

  useEffect(() => setSuggestedTitle(), [categoria]);
  useEffect(() => handleErrors(), [titulo, data, hora, categoria, descricao]);

  return (
    <ScrollView>
      <View style={styles.header}>
        <Pressable onPress={() => console.log("Voltar")}>
          <Icon name="chevron-left" size={40} color="#fff" />
        </Pressable>
        <Text style={styles.tituloheader}>Nova rotina</Text>
      </View>

      <View style={styles.rotina}>
        <View style={styles.titulo}>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Adicionar título"
            placeholderTextColor={"#3D3D3D"}
            style={styles.inputTitulo}
          />
        </View>
        <View style={styles.erroTitulo}>
          <ErrorMessage show={showErrors} text={erros.titulo} />
        </View>
        <View style={styles.dataHora}>
          <Calendar style={styles.iconDataHora} name="calendar" size={20} />
          <MaskInput
            style={styles.textInput}
            value={data}
            onChangeText={setData}
            mask={Masks.DATE_DDMMYYYY}
            placeholder="Data da rotina"
            placeholderTextColor={"#3D3D3D"}
          />
        </View>
        <View style={styles.erro}>
          <ErrorMessage show={showErrors} text={erros.data} />
        </View>

        <View style={styles.dataHora}>
          <Icon
            style={styles.iconDataHora}
            name="clock-time-four-outline"
            size={20}
          />
          <MaskHour
            style={styles.textInput}
            placeholder="Horário de início"
            placeholderTextColor={"#3D3D3D"}
            value={hora}
            maxLength={5}
            inputMaskChange={setHora}
          />
        </View>
        <View style={styles.erro}>
          <ErrorMessage show={showErrors} text={erros.hora} />
        </View>

        <View style={styles.categoria}>
          <Icon style={styles.iconCategoria} name="view-grid-outline" />
          <SelectList
            boxStyles={styles.dropdown}
            inputStyles={styles.categoriaSelecionada}
            data={categorias}
            setSelected={setCategoria}
            placeholder="Categoria"
            search={false}
          />
        </View>
        <View>
          <ErrorMessage show={showErrors} text={erros.categoria} />
        </View>

        <View style={styles.repete}>
          <Text style={styles.repete}>Se repete às:</Text>
        </View>

        <View style={styles.weekDays}>
          <WeekDays callbackFn={setDias} dias={[]} />
        </View>

        <View style={styles.notificacaoContainer}>
          <Switch
            trackColor={{ false: "#767577", true: "#2CCDB5" }}
            onValueChange={setNotificacao}
            value={notificacao}
          />
          <Text style={styles.notificacaoText}>Ativar notificação</Text>
        </View>

        <View style={styles.descricao}>
          <TextInput
            onChangeText={setDescricao}
            value={descricao}
            placeholder="Descrição"
            multiline={true}
            numberOfLines={Platform.OS === "ios" ? undefined : 6}
            style={[
              styles.textInputDescription,
              { minHeight: Platform.OS === "ios" && 6 ? 20 * 6 : null },
            ]}
            placeholderTextColor={"#3D3D3D"}
          />
        </View>
        <View style={styles.erro}>
          <ErrorMessage show={showErrors} text={erros.descricao} />
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
  );
}


const styles = StyleSheet.create({
  notificacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    fontWeight: "700",
    marginBottom: 25,
  },
  notificacaoText: {
    fontWeight: "600",
    marginLeft: 7,
    fontSize: 16,
    color: "#616161",
  },
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
  rotina: {
    flexDirection: "column",
    borderRadius: 15,
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 5,
    marginBottom: 1,
  },
  inputTitulo: {
    color: "#05375a",
    fontSize: 17,
    textAlign: "center",
  },
  dataHora: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
    width: 300,
    marginBottom: 1,
  },
  iconDataHora: {
    fontSize: 25,
    opacity: 0.8,
  },
  textInput: {
    paddingLeft: 10,
    color: "#05375a",
    fontSize: 17,
    width: 280,
  },
  categoria: {
    flexDirection: "row",
    borderBottomWidth: 1,
    width: 300,
    alignItems: "baseline",
    paddingBottom: 5,
  },
  iconCategoria: {
    fontSize: 25,
    opacity: 0.8,
  },
  dropdown: {
    borderWidth: 0,
    paddingLeft: 10,
    width: 280,
    fontSize: 17,
  },
  categoriaSelecionada: {
    fontSize: 17,
  },
  repete: {
    alignSelf: "flex-start",
    marginTop: 10,
    fontSize: 17,
    color: "#616161",
  },
  weekDays: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 0,
  },
  descricao: {
    flexDirection: "row",
    paddingBottom: 5,
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
  },
  textInputDescription: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#F1F1F1",
    fontSize: 17,
    padding: 12,
    paddingTop: 10,
  },
  linkButton: {
    marginTop: 30,
    marginBottom: 40,
    alignItems: "center",
    width: 250,
  },
  erroTitulo: {
    marginBottom: 35,
  },
  erro: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
});
