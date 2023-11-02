import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('vote', (table) => {
    table.increments('id')
    table.integer('user_id').unsigned().references('id').inTable('user').onDelete('CASCADE')
    table.integer('resolution_id').unsigned().references('id').inTable('resolution').onDelete('CASCADE')
    table.enum('value', ['Y', 'N'])
    table.enum('type', ['simple', 'signed'])
    table.timestamp('created_at')
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('vote')
}
