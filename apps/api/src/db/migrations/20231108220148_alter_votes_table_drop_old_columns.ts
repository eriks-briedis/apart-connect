import { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('vote', (table) => {
    table.dropColumn('value')
    table.dropColumn('type')
  }).then()

  await knex.schema.table('vote', (table) => {
    table.boolean('value')
  }).then()
}


export async function down(): Promise<void> {

}

