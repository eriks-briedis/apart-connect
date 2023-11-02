import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resolution', (table) => {
    table.integer('created_by').unsigned().references('id').inTable('user').onDelete('CASCADE')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resolution', (table) => {
    table.dropColumn('created_by')
  })
}

