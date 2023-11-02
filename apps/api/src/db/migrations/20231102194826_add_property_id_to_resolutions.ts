import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resolution', (table) => {
    table.integer('property_id').unsigned().references('id').inTable('property').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resolution', (table) => {
    table.dropColumn('property_id')
  })
}
