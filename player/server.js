const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname)));

app.listen(4455, () => console.log("Local server running on http://localhost:4455"));
