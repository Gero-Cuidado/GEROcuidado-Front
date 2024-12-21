import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, relation } from '@nozbe/watermelondb/decorators';
import Metrica from './Metrica';


export default class ValorMetrica extends Model {
  static table = "valor_metrica";

  @field("metrica_id") idMetrica!: string;
  @field("valor") valor!: string;
  @field("dataHora") dataHora!: number;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  @relation("metrica", "metrica_id") metrica!: Metrica;
}
