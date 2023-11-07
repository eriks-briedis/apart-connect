import type { Knex } from 'knex'

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: process.env.DB_CONNECTION_STRING,
  },

  production: {
    client: 'postgresql',
    connection: process.env.DB_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      extension: 'ts',
      tableName: 'knex_migrations',
    },
  },

}

module.exports = config
