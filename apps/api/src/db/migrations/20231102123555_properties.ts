import { type Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  knex.schema.createTable('property', (table) => {
    table.increments('id')
    table.string('name')
    table.string('address')
    table.string('city')
    table.string('zip')
    table.string('country')
    table.timestamp('created_at')
    table.timestamp('updated_at')
  }).then()
}

export async function down (knex: Knex): Promise<void> {
  knex.schema.dropTable('property')
}
