// setup functions
const {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
} = require("./db");

// function to create db tables & seed data
const init = async () => {
  //  connect to node pg client
  await client.connect();
  console.log("Connected to acme_store_db.");
  // create tables from db
  await createTables();
  console.log("Tables created.");
  // create products
  const [p1, p2, p3] = await Promise.all([
    createProduct({ name: "Apple" }),
    createProduct({ name: "Banana" }),
    createProduct({ name: "Cookie" }),
  ]);
  console.log("Products:", await fetchProducts());
  console.log("Products Seeded.");

  // create users
  const [u1, u2, u3] = await Promise.all([
    createUser({ username: "user1", password: "pass1" }),
    createUser({ username: "user2", password: "pass2" }),
    createUser({ username: "user3", password: "pass3" }),
  ]);
  console.log("Users:", await fetchUsers());
  console.log("Users Seeded.");
};
init();
