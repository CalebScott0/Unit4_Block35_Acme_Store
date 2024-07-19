// express api server
const {
  client,
  createFavorite,
  destroyFavorite,
  fetchFavorites,
  fetchProducts,
  fetchUsers,
} = require("./db");
const express = require("express");
// create express server
const server = express();
// connect to db Client
client.connect();
// middleware - parse request body for route access
server.use(express.json());

// routes
// returns array of users
server.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});
// returns array of products
server.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(error);
  }
});
// returns an array of favorites for a user
server.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites({ user_id: req.params.id }));
  } catch (error) {
    next(error);
  }
});
/* payload: a product_id
   -> returns the created favorite with a status code of 201 */
server.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (error) {
    next(error);
  }
});
// deletes a favorite for a user, returns nothing with a status code of 204
server.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  try {
    await destroyFavorite({ id: req.params.id, user_id: req.params.userId });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
//error handling route which returns an object with an error property
server.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});
// have server listen on port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
