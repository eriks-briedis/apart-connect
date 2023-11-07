import { type Knex } from 'knex'

require('dotenv').config()
const knex = require('knex')

export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'apartconnect',
  },
  migrations: {
    extension: 'ts',
    directory: 'src/db/migrations',
    tableName: 'migrations_history',
  },
}

export const knexInstance: Knex = knex(knexConfig)
