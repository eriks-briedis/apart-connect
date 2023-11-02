import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('property_user', (table) => {
    table.increments('id')
    table.integer('user_id').unsigned().references('id').inTable('user').onDelete('CASCADE')
    table.integer('property_id').unsigned().references('id').inTable('property').onDelete('CASCADE')
    table.timestamp('created_at')
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('property_user')
}
