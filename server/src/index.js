require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const { connectToMongoDb } = require("./connection");

const app = express();
const PORT = process.env.PORT || 3001;

//Connection to Mongodb
connectToMongoDb(
  "mongodb+srv://pradipgharge:ecommerce@ecommerce.o95ca.mongodb.net/ecommerce"
);

//Middlewares
app.use(express.json()); //parse JSON
app.use(cors());

//Routes
app.get("/", (req, res) => {
  res.send("Express app is running");
});

app.use("/user", userRouter);
app.use("/user/cart", cartRouter);
app.use("user/order", orderRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.listen(PORT, () => console.log("Server running on port:", PORT));
