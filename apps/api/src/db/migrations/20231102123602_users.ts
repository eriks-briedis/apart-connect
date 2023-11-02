import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('user', (table) => {
    table.increments('id');
    table.string('first_name');
    table.string('last_name');
    table.string('email').unique();
    table.string('passwordHash');
    table.date('date_of_birth').nullable();
    table.string('phone').nullable;
    table.enum('role', ['admin', 'user']).defaultTo('user');
    table.bigInteger('property_id').unsigned().references('id').inTable('property').onDelete('CASCADE');
    table.timestamp('created_at');
    table.timestamp('updated_at');
  }).then()
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('user');
}

