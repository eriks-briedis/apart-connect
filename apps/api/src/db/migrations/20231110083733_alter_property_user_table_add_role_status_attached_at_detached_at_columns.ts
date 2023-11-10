import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('property_user', (table) => {
    table.enum('role', ['user', 'property_admin', 'super_admin'])
    table.enum('status', ['active', 'removed', 'pending'])
    table.timestamp('attached_at')
    table.timestamp('detached_at')
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('property_user', (table) => {
    table.dropColumn('role')
    table.dropColumn('status')
    table.dropColumn('attached_at')
    table.dropColumn('detached_at')
  }).then()
}
