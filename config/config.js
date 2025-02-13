if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const env = process.env.NODE_ENV;
const dbConfig = JSON.parse(process.env.DB_CONFIG);

module.exports = {
  [env]: {
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  },
};
