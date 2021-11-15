require("dotenv").config();
const path = require("path");

const {
  NODE_ENV = "development",
  DEV_DATABASE_URL,
  PROD_DATABASE_URL,
} = process.env;
const URL =
  NODE_ENV === "production"
    ? PROD_DATABASE_URL
    : DEV_DATABASE_URL;

module.exports = {
  development: {
    client: "postgresql",
    connection: URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  production: {
    client: "postgresql",
    connection: URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },
};