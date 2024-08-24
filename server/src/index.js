const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/user");

const app = express();
const PORT = 3001;

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
app.use(express.json());
app.use(cors());

//routes
app.use("/user", userRouter);

app.listen(PORT, () => console.log("Server started at PORT:", PORT));
