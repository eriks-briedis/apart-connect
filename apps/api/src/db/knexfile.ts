import { type Knex } from 'knex'

require('dotenv').config()
const knex = require('knex')

export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: process.env.DB_CONNECTION_STRING,
  migrations: {
    extension: 'ts',
    directory: 'src/db/migrations',
    tableName: 'migrations_history',
  },
}

export const knexInstance: Knex = knex(knexConfig)
