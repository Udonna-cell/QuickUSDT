export const LOCAL = {
  host: "localhost",
  user: "root",
  password: "",
  database: "quick_usdt_db",
};

export const GLOBAL = {
  host: process.env.HOST || LOCAL.host,
  user: process.env.USER || LOCAL.user,
  password: process.env.PASSWORD || LOCAL.password,
  database: process.env.DATABASE || LOCAL.database,
};

