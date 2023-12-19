import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('initiative', table => {
    table.timestamp('deleted_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('initiative', table => {
    table.dropColumn('deleted_at')
  })
}
