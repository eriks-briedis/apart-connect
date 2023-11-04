import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notification', (table) => {
    table.increments('id')
    table.integer('user_id').unsigned()
    table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE')
    table.string('title').notNullable()
    table.string('message').notNullable()
    table.string('url')
    table.enum('type', ['invitation', 'resolution']).notNullable()
    table.boolean('read').defaultTo(false)
    table.timestamp('created_at')
    table.timestamp('updated_at')
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('notification').then()
}
