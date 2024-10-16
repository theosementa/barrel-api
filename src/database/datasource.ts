import { DataSource } from "typeorm";

const isProduction = process.env.ENVIRONMENT === "BUILD";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "BarrelAPI",
  entities: isProduction
    ? ["build/database/entity/**/*.js"]
    : ["src/database/entity/**/*.ts"],
  synchronize: true, // Keep true until prod and dev base are not the same
  logging: !isProduction,
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
});
