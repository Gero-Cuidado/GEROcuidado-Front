import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Image, Text, View, TextInput, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BackButton from "../components/BackButton";
import CustomButton from "../components/CustomButton";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [escondeSenha, setEscondeSenha] = useState(true);
  const [erros, setErros] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleErrors = () => {
    const erros = {};
    let hasErrors = false;

    if (!email) {
      erros.email = "Campo Obrigatório!";
      hasErrors = true;
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo de email é obrigatório!',
      });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      erros.email = "Email inválido!";
      hasErrors = true;
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Formato de email inválido!',
      });
    }

    if (!senha) {
      erros.senha = "Campo Obrigatório!";
      hasErrors = true;
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo de senha é obrigatório!',
      });
    }
    
    setErros(erros);
    return hasErrors;
  };

  useEffect(() => {
    handleErrors();
  }, [email, senha]);

  const login = async () => {
    if (Object.keys(erros).length > 0) {
      setShowErrors(true);
      return;
    }

    const body = { email: email.toLowerCase().trim(), senha };

    try {
      setShowLoading(true);
      console.log("Iniciando o login...");

      // Simulando resposta de login
      const token = "fake-jwt-token"; // Aqui você pode usar qualquer string como token
      console.log("Token recebido:", token);

      await handleUser(token); // Processa o token recebido
      router.push("/private/pages/listarIdosos");
    } catch (err) {
      console.error("Erro durante o login:", err);
      const error = err.message;
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error,
      });
    } finally {
      setShowLoading(false);
    }
  };

  const handleUser = async (token) => {
    try {
      await AsyncStorage.setItem("token", token);
      const user = {
        id: "1",
        email: email,
        nome: "Usuário Teste",
      };
      await AsyncStorage.setItem("usuario", JSON.stringify(user));
      console.log("Usuário salvo no AsyncStorage:", await AsyncStorage.getItem('usuario'));
    } catch (err) {
      console.error("Erro ao salvar o usuário:", err);
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Erro ao salvar o usuário.",
      });
    }
  };

  return (
    <View>
      <BackButton color="#000" route="/" />

      <ScrollView>
        <View style={styles.imagem}>
          <Image
            source={require("../../../assets/logo2.png")}
            style={{ width: 280, height: 90 }}
          />
        </View>

        <Text style={styles.titulo}>Bem Vindo de volta!</Text>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon style={styles.iconInput} name="email-outline" size={20} />
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              style={styles.textInput}
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.email} />
        </View>

        <View style={styles.formControl}>
          <View style={styles.field}>
            <Icon style={styles.iconInput} name="lock-outline" size={20} />
            <TextInput
              onChangeText={setSenha}
              value={senha}
              placeholder="Senha"
              secureTextEntry={escondeSenha}
              style={styles.passwordInput}
            />

            <Icon
              testID="escondeSenhaIcon"
              onPress={() => setEscondeSenha(!escondeSenha)}
              style={styles.passwordIcon}
              name={escondeSenha ? "eye-outline" : "eye-off-outline"}
              size={20}
            />
          </View>
          <ErrorMessage show={showErrors} text={erros.senha} />
        </View>

        <View style={styles.linkButton}>
          <CustomButton
            title="Entrar"
            callbackFn={login}
            showLoading={showLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  voltar: {
    marginTop: 5,
  },
  formControl: {
    flexDirection: "column",
    width: 320,
    alignItems: "flex-start",
    alignSelf: "center",
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 60,
    marginTop: 35,
  },
  imagem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    width: "80%",
    maxWidth: 350,
    paddingVertical: 16,
    paddingHorizontal: 26,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#2CCDB5",
    textAlign: "center",
  },
  field: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#AFB1B6",
    paddingBottom: 5,
    width: 320,
    height: 30,
    alignSelf: "center",
  },
  iconInput: {
    width: "10%",
  },
  passwordInput: {
    paddingLeft: 10,
    color: "#05375a",
    width: "80%",
    fontSize: 17,
  },
  passwordIcon: {
    width: "10%",
  },
  textInput: {
    width: "90%",
    paddingLeft: 10,
    color: "#05375a",
    fontSize: 17,
  },
  arrow: {
    alignSelf: "flex-start",
  },
  linkButton: {
    marginTop: 90,
    alignItems: "center",
  },
  foto: {
    backgroundColor: "#EFEFF0",
    borderRadius: 25,
    alignItems: "center",
    display: "flex",
    width: 167,
    height: 174,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#AFB1B6",
    marginBottom: 38,
  },
  eye: {
    marginLeft: 100,
  },
});
