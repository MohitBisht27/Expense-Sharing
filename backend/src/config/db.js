import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: process.env.NODE_ENV === "production" ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      } : {},
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        dialectOptions: process.env.NODE_ENV === "production" ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        } : {},
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      },
    );

export const connectDB = async () => {
  try {
    console.log("Attempting database connection...");
    if (process.env.DATABASE_URL) {
      console.log("Using DATABASE_URL connection string...");
    } else {
      console.log(`Using individual DB variables. Target Host: ${process.env.DB_HOST || 'localhost (default)'}`);
    }
    
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Models synchronized");
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
};
export default sequelize;
