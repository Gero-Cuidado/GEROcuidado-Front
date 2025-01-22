import React, { useState } from "react";
import { Image, View, StyleSheet, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
  setFoto: (foto: string) => void;
  uri?: string | null;
}

export default function UploadImage({ setFoto, uri = null }: Readonly<Props>) {
  const [image, setImage] = useState<string | undefined | null>(uri);

  const pickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0,
    }).then((result) => {
      if (result.canceled) return; // Caso o usuário cancele a seleção

      // Verifica se a URI e o base64 existem antes de tentar usar
      const selectedImageUri = result.assets?.[0]?.uri;
      const selectedImageBase64 = result.assets?.[0]?.base64;

      if (selectedImageUri && selectedImageBase64) {
        setImage(selectedImageUri);  // Atualiza o estado com a URI
        setFoto(selectedImageBase64); // Passa o base64 para o callback
      }
    });
  };

  return (
    <View style={styles.foto}>
      <Icon style={styles.icone} name="image-outline" size={20} />
      <Pressable
        style={styles.botao}
        onPress={pickImage}
        testID="upload-image-botao"
      />
      {/* Renderiza a imagem ou um ícone, se image for inválido */}
      {image ? (
        <Image source={{ uri: image }} style={styles.imagem} />
      ) : (
        <Icon name="image-outline" size={100} color="#AFB1B6" style={styles.icone} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imagem: {
    position: "absolute",
    width: 170,
    height: 170,
    zIndex: 2,
    borderRadius: 25,
  },
  foto: {
    position: "relative",
    backgroundColor: "#EFEFF0",
    borderRadius: 25,
    alignItems: "center",
    display: "flex",
    width: 170,
    height: 170,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#AFB1B6",
    marginBottom: 38,
  },
  botao: {
    width: 167,
    height: 174,
    backgroundColor: "transparent",
    zIndex: 3,
  },
  icone: {
    position: "absolute",
    right: "44%",
    bottom: "44%",
    opacity: 0.4,
    margin: "auto",
    alignSelf: "center",
    zIndex: 1,
  },
});
