import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('notification', (table) => {
    table.dropColumn('type')
  }).then()

  await knex.schema.alterTable('notification', (table) => {
    table.string('type')
  }).then()
}

export async function down(): Promise<void> {
}
