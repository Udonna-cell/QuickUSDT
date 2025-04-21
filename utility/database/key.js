export const LOCAL = {
  host: "localhost",
  user: "root",
  password: "",
  database: "users",
};
export const GLOBAL = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};
