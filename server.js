const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

//app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE_URL)
  .then((res) => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Connect error");
  });

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//route
app.get("/api", (req, res) => {
  res.json({
    data: "hey you hit api test",
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
