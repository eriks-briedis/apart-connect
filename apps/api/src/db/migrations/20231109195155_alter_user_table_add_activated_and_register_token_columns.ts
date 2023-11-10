import { Knex } from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('user', (table) => {
    table.boolean('is_verified').defaultTo(false)
    table.boolean('password_reset').defaultTo(false)
    table.string('token')
  }).then()
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('user', (table) => {
    table.dropColumn('is_verified')
    table.dropColumn('password_reset')
    table.dropColumn('token')
  }).then()
}

