//start express  .  connect mongodb  .  load routes//
require("dotenv").config();

const connectDB = require("./config/db");
const app = require("./app")

connectDB();

app.listen(8000, () => {
  console.log("Server running on port http://localhost:8000 🚀");
});
