import { Model } from "@nozbe/watermelondb";
import { field, text, readonly, date, children } from "@nozbe/watermelondb/decorators";
import ValorMetrica from "./ValorMetrica";

export default class Metrica extends Model {
  static table = 'metrica';
  
  @field('idoso_id') idIdoso: string; // Remova o "!"
  @text('categoria') categoria: string; // Remova o "!"
  @text('valorMaximo') valorMaximo: string; // Remova o "!"
  @readonly @date('created_at') created_at: Date; // Remova o "!"

  // Adicione o construtor chamando o construtor da superclasse
  constructor(
    idIdoso: string,
    categoria: string,
    valorMaximo: string,
    created_at: Date
  ) {
    super(); // Chama o construtor da classe base
    this.idIdoso = idIdoso; // Inicialização
    this.categoria = categoria; // Inicialização
    this.valorMaximo = valorMaximo; // Inicialização
    this.created_at = created_at; // Inicialização
  }
}