import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('property', (table) => {
    table.integer('number_of_units')
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('property', (table) => {
    table.dropColumn('number_of_units')
  }).then()
}

