import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('invitation', (table) => {
    table.increments('id')
    table.string('email').notNullable()
    table.integer('user_id').unsigned()
    table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE')
    table.integer('invited_by').unsigned().notNullable()
    table.foreign('invited_by').references('id').inTable('user').onDelete('CASCADE')
    table.string('token').notNullable()
    table.integer('property_id').unsigned().notNullable()
    table.foreign('property_id').references('id').inTable('property').onDelete('CASCADE')
    table.enum('status', ['pending', 'accepted', 'declined']).defaultTo('pending')
    table.timestamp('expires_at').notNullable()
    table.timestamp('created_at')
    table.timestamp('updated_at')
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('invitation').then()
}

