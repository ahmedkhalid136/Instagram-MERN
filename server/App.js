const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const { report } = require("./routes/auth");

require("./models/user");

app.use(express.json());
app.use(require("./routes/auth"));

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});
mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
