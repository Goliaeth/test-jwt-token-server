require("dotenv").config()

module.exports = {
  PORT: process.env.PORT,
  pg: {
    client: "pg",
    // version: '8.7',
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: process.env.PG_PASS,
      database: "authDB",
    },
  },
}
