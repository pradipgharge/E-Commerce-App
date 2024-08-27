require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

const app = express();
const PORT = process.env.PORT || 3001;

//connection to mongodb
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

//middlewares
app.use(express.json()); //parse JSON
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("Express app is running");
});
app.use("/user", userRouter);
app.use("/products", productRouter);

app.listen(PORT, () => console.log("Server running on port:", PORT));
