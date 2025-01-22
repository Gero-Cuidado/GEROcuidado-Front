import React, { useEffect, useState } from "react";
import { View, TextInput,  ScrollView, Pressable, ActivityIndicator, Text } from "react-native";
import Toast from "react-native-toast-message";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import BackButton from "../../components/BackButton";
import ErrorMessage from "../../components/ErrorMessage";
import CustomButton from "../../components/CustomButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ModalConfirmation from "../../components/ModalConfirmation";
import { SelectList } from "react-native-dropdown-select-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskInput, { Masks } from "react-native-mask-input";
import UploadImageV2 from "../../components/UploadImageV2";
import { getTipoSanguineoOptions } from "../../shared/helpers/useNotification";
import styles from "../../components/style/styles";

interface IErrors {
  nome?: string;
  dataNascimento?: string;
  tipoSanguineo?: string;
  telefoneResponsavel?: string;
  descricao?: string;
}

export default function EditarIdoso() {
  const getDateFromEdit = (date: string) => {
    const data = new Date(date);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${dia}/${mes}/${ano}`;
  };

  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [nome, setNome] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState<string | null | undefined>(null);
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [descricao, setDescricao] = useState<string | undefined>(undefined);

  const [erros, setErros] = useState<IErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingApagar, setShowLoadingApagar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [maskedTelefoneResponsavel, setMaskedTelefoneResponsavel] = useState(telefoneResponsavel);

  const getUserData = async () => {
    try {
      const response = await AsyncStorage.getItem("usuario");
      if (response) {
        const usuario = JSON.parse(response);
        setNome(usuario.nome);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getDateIsoString = (value: string) => {
    const dateArray = value.split("/");
    return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T12:00:00.000Z`;
  };

  const salvar = async () => {
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }

    const body = {
      nome,
      dataNascimento: getDateIsoString(dataNascimento),
      telefoneResponsavel,
      foto,
      tipoSanguineo: tipoSanguineo ?? '',
      descricao: descricao ?? '',
    };

    try {
      setShowLoading(true);
      // Simulando a gravação de dados
      await AsyncStorage.setItem("idoso", JSON.stringify(body));

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Idoso atualizado com sucesso.",
      });
    } catch (err) {
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoading(false);
    }
  };

  const isBase64Image = (str: string): boolean => {
    const expression = `data:image\/([a-zA-Z]*);base64,([^\"]*)`;
    const regex = new RegExp(expression);

    return regex.test(str);
  };

  const apagarIdoso = async () => {
    setModalVisible(false);
    setShowLoadingApagar(true);
    try {
      // Simulando a remoção de dados
      await AsyncStorage.removeItem("idoso");

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Idoso apagado com sucesso.",
      });
    } catch (err) {
      const error = err as { message: string };
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoadingApagar(false);
    }
  };

  const confirmation = () => {
    setModalVisible(!modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => handleErrors(), [nome, telefoneResponsavel, dataNascimento]);

  const handleErrors = () => {
    const erros: IErrors = {};

    if (!nome) {
      erros.nome = "Campo obrigatório!";
    } else if (nome.length < 5) {
      erros.nome = "O nome completo deve ter pelo menos 5 caractéres.";
    } else if (nome.length > 60) {
      erros.nome = "O nome completo deve ter no máximo 60 caractéres.";
    }

    if (!dataNascimento) {
      erros.dataNascimento = "Campo obrigatório!";
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento as string)) {
      erros.dataNascimento = "Data deve ser no formato dd/mm/yyyy!";
    }

    if (!telefoneResponsavel) {
      erros.telefoneResponsavel = "Campo obrigatório!";
    } else if (telefoneResponsavel.length !== 11) {
      erros.telefoneResponsavel = "Deve estar no formato (XX)XXXXX-XXXX";
    }

    setErros(erros);
  };

  const data = getTipoSanguineoOptions();

  return (
    <View>
      <BackButton route="/private/pages/listarIdosos" color="#000" />

      <ScrollView>
        <UploadImageV2 setPhotoCallback={setFoto} base64={foto}></UploadImageV2>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon style={styles.iconInput} name="account-outline" size={20} />
            <TextInput
              onChangeText={setNome}
              value={nome}
              placeholder="Nome"
              style={styles.textInput}
            />
          </View>
          <View testID="Erro-nome">
            <ErrorMessage show={showErrors} text={erros.nome} />
          </View>
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon style={styles.iconInput} name="cake-variant-outline" size={20} />
            <MaskInput
              style={styles.textInput}
              value={dataNascimento as string}
              onChangeText={setDataNascimento}
              mask={Masks.DATE_DDMMYYYY}
              placeholder="Data de Nascimento"
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.dataNascimento} />
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <AntDesign style={styles.iconInput} name="phone" size={20} />
            <MaskInput
              style={styles.textInput}
              value={maskedTelefoneResponsavel}
              onChangeText={(masked, unmasked) => {
                setTelefoneResponsavel(unmasked);
                setMaskedTelefoneResponsavel(masked);
              }}
              mask={Masks.BRL_PHONE}
              placeholder="Telefone Responsável"
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.telefoneResponsavel} />
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Fontisto style={styles.iconInput} name="left-align" size={15} />
            <TextInput
              onChangeText={setDescricao}
              value={descricao}
              placeholder="Descrição"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.formControl2}>
          <View style={styles.field}>
            <Fontisto style={styles.iconInput2} name="blood-drop" size={20} />
            <View style={styles.formControl2}>
              <SelectList
                boxStyles={styles.dropdown}
                inputStyles={styles.textInput}
                data={data}
                setSelected={setTipoSanguineo}
                placeholder="Tipo Sanguíneo"
                search={false}
                defaultOption={{
                  key: tipoSanguineo,
                  value: tipoSanguineo,
                }}
              />
            </View>
          </View>
          <ErrorMessage show={showErrors} text={erros.tipoSanguineo} />
        </View>

        <View style={styles.linkButton}>
          <CustomButton
            title="Salvar"
            callbackFn={salvar}
            showLoading={showLoading}
          />
        </View>

        <Pressable onPress={confirmation}>
          {showLoadingApagar ? (
            <ActivityIndicator size="small" color="#FF7F7F" />
          ) : (
            <Text style={styles.apagarEditar}>Apagar Idoso</Text>
          )}
        </Pressable>

        <ModalConfirmation
          visible={modalVisible}
          callbackFn={apagarIdoso}
          closeModal={closeModal}
          message={`Apagar registro do ${nome}?`}
          messageButton="Apagar"
        />
      </ScrollView>
    </View>
  );
}
