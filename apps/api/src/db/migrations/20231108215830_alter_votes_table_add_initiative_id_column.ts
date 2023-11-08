import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('vote', (table) => {
    table.dropColumn('resolution_id')
    table.integer('initiative_id').unsigned().references('id').inTable('initiative').onDelete('CASCADE')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('vote', (table) => {
    table.dropColumn('initiative_id')
    table.integer('resolution_id').unsigned().references('id').inTable('resolution').onDelete('CASCADE')
  })
}

