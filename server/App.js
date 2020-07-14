const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const { report } = require("./routes/auth");
const bodyParser = require('body-parser')
// app.use(bodyparser.json());
app.use(bodyParser.json())

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});
mongoose.connection.on("error", (err) => {
  console.log("error connecting", err);
});


require("./models/user");
require("./models/post")

app.use(express.json());

app.use(require("./routes/auth"));


app.use(require("./routes/post"));

const PORT = 5001;

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
