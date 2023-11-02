import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('resolution', (table) => {
    table.increments('id');
    table.string('label');
    table.string('description');
    table.enum('status', ['draft', 'open', 'closed']).defaultTo('draft');
    table.enum('type', ['info', 'signed', 'emergency']).defaultTo('info');
    table.timestamp('created_at');
    table.timestamp('updated_at');
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('resolution');
}

