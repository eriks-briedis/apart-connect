import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('initiative', (table) => {
    table.increments('id')
    table.string('label')
    table.string('description')
    table.enum('status', ['draft', 'open', 'closed']).defaultTo('draft')
    table.enum('type', ['poll', 'majority', 'unanimous']).defaultTo('poll')
    table.boolean('requires_signature').defaultTo(false)
    table.integer('created_by').unsigned().references('id').inTable('user')
    table.integer('property_id').unsigned().references('id').inTable('property')
    table.timestamp('expires_at')
    table.timestamp('created_at')
    table.timestamp('updated_at')
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('initiative')
}

