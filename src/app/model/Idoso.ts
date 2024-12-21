import { Model } from '@nozbe/watermelondb';
import { text, field, readonly, relation, date, children } from '@nozbe/watermelondb/decorators';
import Usuario from './Usuario';
import Metrica from './Metrica';

export default class Idoso extends Model {
  static table = 'idoso';

  @field('nome') nome!: string;
  @field('dataNascimento') dataNascimento!: string;
  @field('tipoSanguineo') tipoSanguineo!: string;
  @field('telefoneResponsavel') telefoneResponsavel!: string;
  @field('descricao') descricao!: string;
  @field('foto') foto!: string;
  @field('user_id') userId!: string;

  @relation('usuario', 'user_id') user!: Usuario;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('metrica') metricas!: Metrica[];
}
