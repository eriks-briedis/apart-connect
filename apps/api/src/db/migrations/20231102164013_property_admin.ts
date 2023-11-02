import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  knex.schema.alterTable('property', (table) => {
    table.bigInteger('admin_id').references('id').inTable('user').onDelete('CASCADE')
  }).then()
}


export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable('property', (table) => {
    table.dropColumn('admin_id')
  }).then()
}

