const app = require("./app");
const mongodb = require("./mongodb/mongodb.connect");

const PORT = process.env.PORT || 3015;

mongodb.connect();

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
