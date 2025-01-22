import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getImageUri, noImage } from "../shared/helpers/image.helper";
import { Image } from "expo-image";

interface Props {
  setPhotoCallback: (value: string | undefined) => void;
  base64: string | undefined;
}

export default function UploadImageV2({
  setPhotoCallback,
  base64,
}: Readonly<Props>) {
  const [photo, setPhoto] = useState<string | undefined>(base64);

  useEffect(() => {
    if (base64) {
      const uri = getImageUri(base64);
      setPhoto(uri);
    }
  }, [base64]); // Atualize o estado se base64 mudar

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (result.assets && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setPhotoCallback(result.assets[0].base64 as string);
    }
  };

  return (
    <Pressable
      style={styles.foto}
      onPress={pickPhoto}
      testID="uploadImageButton"
    >
      <Icon style={styles.icone} name="image-outline" size={20} />
      <Image
        source={{ uri: photo || noImage }} // Usar uma URL padrão se `photo` for inválido
        style={styles.imagem}
        placeholder={{ uri: noImage }}
        transition={500}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  foto: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 50,
  },
  icone: {
    position: "absolute",
    zIndex: 2,
  },
  imagem: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});
