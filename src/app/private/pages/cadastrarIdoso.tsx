import React, { useState, useEffect } from "react";
import { View, TextInput, ScrollView, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskInput, { Masks } from "react-native-mask-input";
import { useRouter } from "expo-router";
import BackButton from "../../components/BackButton";
import ErrorMessage from "../../components/ErrorMessage";
import CustomButton from "../../components/CustomButton";
import UploadImageV2 from "../../components/UploadImageV2";
import SelectList from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import styles from "../../components/style/styles";

export default function CadastrarIdoso() {
  const [nome, setNome] = useState<string>("");
  const [dataNascimento, setDataNascimento] = useState<string>("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [tipoSanguineo, setTipoSanguineo] = useState<string>("");
  const [foto, setFoto] = useState<string>("");
  const [maskedTelefoneResponsavel, setMaskedTelefoneResponsavel] = useState<string>("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const router = useRouter();

  const data = [
    { key: "A+", value: "A+" },
    { key: "A-", value: "A-" },
    { key: "B+", value: "B+" },
    { key: "B-", value: "B-" },
    { key: "O+", value: "O+" },
    { key: "O-", value: "O-" },
    { key: "AB+", value: "AB+" },
    { key: "AB-", value: "AB-" },
  ];

  const handleErrors = () => {
    const novosErros: Record<string, string> = {};
    if (!nome.trim()) novosErros.nome = "O nome é obrigatório!";
    if (!dataNascimento.trim()) novosErros.dataNascimento = "A data de nascimento é obrigatória!";
    if (!telefoneResponsavel.trim()) novosErros.telefoneResponsavel = "O telefone do responsável é obrigatório!";
    if (!tipoSanguineo) novosErros.tipoSanguineo = "O tipo sanguíneo é obrigatório!";
    setErros(novosErros);
    return novosErros;
  };

  useEffect(() => {
    if (showErrors) {
      handleErrors();
    }
  }, [nome, dataNascimento, telefoneResponsavel, tipoSanguineo]);

  const salvarNoAsyncStorage = async () => {
    const novoIdoso = {
      id: Date.now().toString(),
      nome,
      dataNascimento,
      telefoneResponsavel,
      descricao,
      tipoSanguineo,
      foto,
    };

    try {
      setShowLoading(true);
      const idososString = await AsyncStorage.getItem("idosos");
      const idosos = idososString ? JSON.parse(idososString) : [];
      idosos.push(novoIdoso);
      await AsyncStorage.setItem("idosos", JSON.stringify(idosos));
      ToastAndroid.show("Idoso cadastrado com sucesso!", ToastAndroid.SHORT);
      router.replace("/private/pages/listarIdosos");
    } catch (error) {
      console.error("Erro ao salvar idoso:", error);
      ToastAndroid.show("Erro ao salvar idoso!", ToastAndroid.SHORT);
    } finally {
      setShowLoading(false);
    }
  };

  const salvar = () => {
    const errosValidados = handleErrors();
    if (Object.keys(errosValidados).length > 0) {
      setShowErrors(true);
      return;
    }
    salvarNoAsyncStorage();
  };

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
            <Icon
              style={styles.requiredIcon}
              name="asterisk"
              size={10}
              color="red"
            />
          </View>
          <View testID="Erro-nome">
            <ErrorMessage show={showErrors} text={erros.nome} />
          </View>
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon
              style={styles.iconInput}
              name="cake-variant-outline"
              size={20}
            />
            <MaskInput
              style={styles.textInput}
              value={dataNascimento}
              onChangeText={setDataNascimento}
              mask={Masks.DATE_DDMMYYYY}
              placeholder="Data de Nascimento"
            />
            <Icon
              style={styles.requiredIcon}
              name="asterisk"
              size={10}
              color="red"
            />
          </View>
          <View testID="Erro-data">
            <ErrorMessage show={showErrors} text={erros.dataNascimento} />
          </View>
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
            <Icon
              style={styles.requiredIcon}
              name="asterisk"
              size={10}
              color="red"
            />
          </View>
          <View testID="Erro-telefone">
            <ErrorMessage show={showErrors} text={erros.telefoneResponsavel} />
          </View>
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
              />
            </View>
          </View>
          <ErrorMessage show={showErrors} text={erros.tipoSanguineo} />
        </View>

        <View style={styles.linkButton}>
          <CustomButton
            title="Cadastrar"
            callbackFn={salvar}
            showLoading={showLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
}
