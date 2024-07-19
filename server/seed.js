// setup functions
const {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
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
  console.log("Seeded Products.");

  // create users
  const [u1, u2, u3] = await Promise.all([
    createUser({ username: "user1", password: "pass1" }),
    createUser({ username: "user2", password: "pass2" }),
    createUser({ username: "user3", password: "pass3" }),
  ]);
  console.log("Users:", await fetchUsers());
  console.log("Seeded Users.");

  // create favorites with favorites array
  const favorites = await Promise.all([
    createFavorite({ user_id: u1.id, product_id: p1.id }),
    createFavorite({ user_id: u1.id, product_id: p3.id }),
    createFavorite({ user_id: u2.id, product_id: p2.id }),
    createFavorite({ user_id: u3.id, product_id: p3.id }),
  ]);
  console.log("user1 favorites:", await fetchFavorites({ user_id: u1.id }));
  console.log("Seeded Favorites.");
  // destroy first favorite in array (first of 2 favorites for user1)
  await destroyFavorite({ id: favorites[0].id, user_id: favorites[0].user_id });
  //  shows user1 now has only 1 favorite
  console.log(
    "user1 favorites after destroy:",
    await fetchFavorites({ user_id: u1.id })
  );
  await client.end();
};
init();
