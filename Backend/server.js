require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const port = process.env.PORT || 3000;

connectToDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
