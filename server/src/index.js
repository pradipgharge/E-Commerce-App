require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const cartRouter = require("./routes/cart");

const app = express();
const PORT = process.env.PORT || 3001;

//Connection to Mongodb
mongoose
  .connect(
    "mongodb+srv://pradipgharge:ecommerce@ecommerce.o95ca.mongodb.net/ecommerce"
  )
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });

//Middlewares
app.use(express.json()); //parse JSON
app.use(cors());

//Routes
app.get("/", (req, res) => {
  res.send("Express app is running");
});

app.use("/user", userRouter);
app.use("/user/cart", cartRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.listen(PORT, () => console.log("Server running on port:", PORT));
