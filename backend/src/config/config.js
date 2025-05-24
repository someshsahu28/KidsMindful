module.exports = {
  development: {
    username: "postgres",
    password: "postgres",
    database: "kidsmindful_dev",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false // Disable SQL query logging
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "kidsmindful_test",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false
  }
}; 