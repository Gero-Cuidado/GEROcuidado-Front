import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleNotificacao = async (
  notificacao: boolean,
  setNotificacao: React.Dispatch<React.SetStateAction<boolean>>,
  setExpoToken: React.Dispatch<React.SetStateAction<string>>
) => {
  // Verifica se as notificações estão habilitadas
  if (!notificacao) return;

  // Configuração do canal de notificações para Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Verifica permissões de notificações
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Solicita permissões, se necessário
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Verifica se a permissão foi concedida
  if (finalStatus !== "granted") {
    alert("É necessário permitir as notificações!");
    setNotificacao(false);
    return;
  }

  // Obtém o token de push
  const response = await Notifications.getExpoPushTokenAsync({
    projectId: "7028a81c-adee-41de-91a7-b7e80535a448",
  });
  setExpoToken(response.data);

  // Armazena o token de notificação no AsyncStorage
  try {
    await AsyncStorage.setItem('expoPushToken', response.data);
  } catch (error) {
    console.error("Erro ao salvar token no AsyncStorage:", error);
  }
};

interface IErrors {
  titulo?: string;
  data?: string;
  hora?: string;
  categoria?: string;
  descricao?: string;
}

export const validateFields = (
  titulo: string,
  data: string,
  hora: string,
  categoria: string | null, // Alterado para string simples para remover a dependência de interfaces
  descricao: string,
  setErros: React.Dispatch<React.SetStateAction<IErrors>>
) => {
  const erros: IErrors = {};

  if (!titulo) {
    erros.titulo = "Campo obrigatório!";
  } else if (titulo.length > 100) {
    erros.titulo = "O título deve ter no máximo 100 caracteres.";
  }

  if (!data) {
    erros.data = "Campo obrigatório!";
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    erros.data = "Data deve ser no formato dd/mm/yyyy!";
  }

  if (!hora) {
    erros.hora = "Campo obrigatório!";
  } else if (!/^\d{2}:\d{2}$/.test(hora)) {
    erros.hora = "Hora deve ser no formato hh:mm!";
  }

  // Verifica se categoria é null
  if (categoria === null) {
    erros.categoria = "Campo obrigatório!";
  }

  if (descricao?.length > 300) {
    erros.descricao = "A descrição deve ter no máximo 300 caracteres.";
  }

  setErros(erros);
};

export const getTipoSanguineoOptions = () => {
  // Definição dos tipos sanguíneos sem dependência de enums ou interfaces externas
  const tiposSanguineos = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ];
  return tiposSanguineos.map((tipo) => ({
    key: tipo,
    value: tipo,
  }));
};
