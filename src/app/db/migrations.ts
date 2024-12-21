import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import { tableSchema } from '@nozbe/watermelondb';

export default schemaMigrations({
  migrations: [
    // Versão 2: Criar tabela 'usuario'
    {
      toVersion: 2,
      steps: [
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'usuario',
            columns: [
              { name: 'nome', type: 'string' },
              { name: 'foto', type: 'string', isOptional: true },
              { name: 'email', type: 'string' },
              { name: 'senha', type: 'string' },
              { name: 'admin', type: 'boolean', isOptional: true },
            ],
          }),
        },
      ],
    },
    // Versão 3: Adicionar 'created_at' e 'updated_at' na tabela 'usuario'
    {
      toVersion: 3,
      steps: [
        {
          type: 'add_columns',
          table: 'usuario',
          columns: [
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        },
      ],
    },
    // Versão 4: Criar tabelas 'idoso', 'rotina', 'metrica' e 'valor_metrica'
    {
      toVersion: 4,
      steps: [
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'idoso',
            columns: [
              { name: 'nome', type: 'string' },
              { name: 'dataNascimento', type: 'string' },
              { name: 'tipoSanguineo', type: 'string' },
              { name: 'telefoneResponsavel', type: 'string' },
              { name: 'descricao', type: 'string' },
              { name: 'foto', type: 'string' },
              { name: 'user_id', type: 'string', isIndexed: true },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' },
            ],
          }),
        },
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'rotina',
            columns: [
              { name: 'titulo', type: 'string' },
              { name: 'categoria', type: 'string' },
              { name: 'dias', type: 'string' },
              { name: 'dataHora', type: 'number' },
              { name: 'descricao', type: 'string' },
              { name: 'token', type: 'string' },
              { name: 'notificacao', type: 'boolean' },
              { name: 'dataHoraConcluidos', type: 'string' },
              { name: 'idoso_id', type: 'string', isIndexed: true },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' },
            ],
          }),
        },
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'metrica',
            columns: [
              { name: 'idoso_id', type: 'string', isIndexed: true },
              { name: 'categoria', type: 'string' },
              { name: 'valorMaximo', type: 'string', isOptional: true },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' },
            ],
          }),
        },
        {
          type: 'create_table',
          schema: tableSchema({
            name: 'valor_metrica',
            columns: [
              { name: 'metrica_id', type: 'string', isIndexed: true },
              { name: 'valor', type: 'string' },
              { name: 'dataHora', type: 'number' },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' },
            ],
          }),
        },
      ],
    },
    // Versão 5 a 7 (Caso haja mais alterações, você pode adicionar novas migrações)
    // Pode adicionar outras migrações aqui se for necessário para versões acima de 4
  ],
});
