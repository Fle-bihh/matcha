require("dotenv").config();

class Config {
  public readonly port: number;
  public readonly webUrl: string;
  public readonly database: {
    host: string;
    user: string;
    password: string;
    database: string;
    pool: {
      connectionLimit: number;
    };
  };
  public readonly jwtSecret: string;
  public readonly jwtExpiresIn: string;
  public readonly jwtRefreshSecret: string;
  public readonly jwtRefreshExpiresIn: string;
  public readonly mail: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
  };

  constructor() {
    this.port = Number(process.env.SERVER_PORT) || 3000;
    this.webUrl = process.env.WEB_URL || "http://localhost:3001";
    this.database = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "matcha",
      pool: {
        connectionLimit: Number(process.env.DB_POOL_CONNECTION_LIMIT) || 10,
      },
    };
    this.jwtSecret =
      process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
    this.jwtRefreshSecret =
      process.env.JWT_REFRESH_SECRET ||
      "your-refresh-secret-key-change-this-in-production";
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    this.mail = {
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === "true" || false,
      user: process.env.MAIL_USER || "",
      password: process.env.MAIL_PASSWORD || "",
      from: process.env.MAIL_FROM || "noreply@matcha.com",
    };
  }
}

export const config = new Config();
