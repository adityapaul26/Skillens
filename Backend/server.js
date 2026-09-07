require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const port = process.env.PORT || 3000;
const {
  resume,
  selfDescription,
  jobDescription,
} = require("./src/services/sampleInput");

const { generateInterviewReport } = require("./src/services/ai.service");

connectToDB();

generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
