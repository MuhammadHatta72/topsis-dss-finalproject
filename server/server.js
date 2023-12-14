// import libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

// import routes
const criteriasRoutes = require("./services/criterias/criterias.routes");
const alternativesRoutes = require("./services/alternatives/alternatives.routes");
const matrixvaluesRoutes = require("./services/matrix_values/matrix_values.routes");

// create express app
const app = express();
const PORT = process.env.PORT;

// connect to database
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

// define routes
app.use("/api", criteriasRoutes);
app.use("/api", alternativesRoutes);
app.use("/api", matrixvaluesRoutes);

app.get("/api/home", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the home page",
  });
});

//call connect function
db();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
