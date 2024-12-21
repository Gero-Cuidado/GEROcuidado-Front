import { Model, Q, RawRecord } from '@nozbe/watermelondb';

export interface IValorMetrica {
  idMetrica: string;
  valor: string;
  dataHora: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IValorMetricaRaw {
  _raw: RawRecord;
  idMetrica: string;
  valor: string;
  dataHora: Date;
  createdAt: Date;
  updatedAt: Date;
}


export enum EMetricas {
  FREQ_CARDIACA = "Frequência Cardíaca",
  TEMPERATURA = "Temperatura",
  PRESSAO_SANGUINEA = "Pressão",
  PESO = "Peso",
  GLICEMIA = "Glicemia",
  SATURACAO_OXIGENIO = "Saturação",
  ALTURA = "Altura",
  HORAS_DORMIDAS = "Horas Dormidas",
  IMC = "IMC",
  HIDRATACAO = "Hidratação",
}

export interface IMetricaBody {
  idIdoso: number;
  categoria: EMetricas;
  valorMaximo?: string;
}

export interface IMetrica extends IMetricaBody {
  id: number;
}

export interface IValorMetricaBody {
  valor: string;
  dataHora: Date | string;
  idMetrica: number;
}




export interface IMetricaFilter {
  idIdoso: number;
}

export interface IMetricaValueFilter {
  idMetrica: number;
}

export interface IValorMetricaCategoria extends IValorMetrica {
  categoria: EMetricas;
}

export interface IOrder {
  column: string;
  dir: "ASC" | "DESC";
}

