import { Platform } from "react-native";
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations"; // Apenas deixe a migração no seu arquivo separado

import Usuario from "../model/Usuario";
import Idoso from "../model/Idoso";
import Rotina from "../model/Rotina";
import Metrica from "../model/Metrica";
import ValorMetrica from "../model/ValorMetrica";

// Configurar o adaptador SQLite
const adapter = new SQLiteAdapter({
  schema, // O schema deve já estar configurado com versão e migrações
  jsi: true, // Recomendado para iOS
  onSetUpError: (error) => {
    console.error("Erro ao configurar o banco de dados", error);
  },
});

// Criar a instância do banco de dados
const database = new Database({
  adapter,
  modelClasses: [Usuario, Idoso, Rotina, Metrica, ValorMetrica],
});

export default database;


