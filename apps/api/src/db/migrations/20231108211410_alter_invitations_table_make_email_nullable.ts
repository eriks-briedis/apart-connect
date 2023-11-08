import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('invitation', (table) => {
    table.string('email').nullable().alter()
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('invitation', (table) => {
    table.string('email').notNullable().alter()
  }).then()
}

