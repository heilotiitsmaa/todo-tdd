const app = require("./app");
const mongodb = require("./mongodb/mongodb.connect");

const PORT = process.env.PORT || 3000;

mongodb.connect();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
