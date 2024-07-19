// Data layer
const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
// initialize new node pg client
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_store_db"
);

// drop and create database tables - Favorites, Users, Products
const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(100)
        );
        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(100) 
            UNIQUE NOT NULL,password VARCHAR(255)
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            product_id UUID references products(id) NOT NULL,
            user_id UUID references users(id) NOT NULL,
            CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
        );
    `;
  await client.query(SQL);
};
// creates a product in the database and returns the created record
const createProduct = async ({ name }) => {
  const SQL = `INSERT INTO products(id, name) 
                VALUES($1, $2) RETURNING *
                `;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};
// returns an array of products in the database
const fetchProducts = async () => {
  const SQL = `
          SELECT * FROM products;
      `;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};
/* creates a user in the database and returns the created record. 
The password of the user should be hashed using bcrypt. */
const createUser = async ({ username, password }) => {
  const SQL = `
        INSERT INTO users(id, username, password) 
        VALUES($1, $2, $3) RETURNING *;
    `;
  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, process.env.SALT_ROUNDS || 5),
  ]);
  return dbResponse.rows[0];
};
// returns an array of users in the database
const fetchUsers = async () => {
  const SQL = `
        SELECT * FROM users ORDER BY username;
    `;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};
// creates a favorite in the database and returns the created record
const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
        INSERT INTO favorites(id, user_id, product_id) 
        VALUES($1, $2, $3) RETURNING *;
    `;
  const dbResponse = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return dbResponse.rows[0];
};
// returns an array of favorites for a user
const fetchFavorites = async ({ user_id }) => {
  const SQL = `
        SELECT * FROM favorites WHERE user_id=$1;
    `;
  const dbResponse = await client.query(SQL, [user_id]);
  return dbResponse.rows;
};
// deletes a favorite in the db
const destroyFavorite = async ({ id, user_id }) => {
  const SQL = `
        DELETE FROM favorites WHERE id=$1 AND user_id=$2;
    `;
  await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
