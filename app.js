const express = require("express");

const authRoutes = require("./routes/auth.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const { connect } = require("mongoose");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionRoutes);

module.exports = app;
