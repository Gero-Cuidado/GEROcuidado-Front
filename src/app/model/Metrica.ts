import { Model } from "@nozbe/watermelondb";
import { field, readonly, date } from "@nozbe/watermelondb/decorators";

export default class Metrica extends Model {
  static table = "metrica";

  @field("idoso_id") idIdoso!: string;
  @field("categoria") categoria!: string;
  @field("valorMaximo") valorMaximo?: string;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}
