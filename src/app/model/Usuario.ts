import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import Idoso from './Idoso';

export default class Usuario extends Model {
  static table = 'usuario';

  @field('nome') nome!: string;
  @field('foto') foto!: string;
  @field('email') email!: string;
  @field('senha') senha!: string;
  @field('admin') admin!: boolean;

  @readonly @field('created_at') created_at!: number;
  @readonly @field('updated_at') updated_at!: number;

  @children('idoso') idosos!: Idoso[];
}

