import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  port: number;
  debugLogging: boolean;
  dbEntitiesPath: string[];
  cronJobExpression: string;
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
  port: +(process.env.PORT || 3000),
  debugLogging: isDevMode,
  dbEntitiesPath: [
    ...isDevMode ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
  ],
  cronJobExpression: "0 * * * *"
};

export { config };