const app = require("./app");
const connectDB = require("./src/config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    console.log(`[Docs]   API base: http://localhost:${PORT}/api`);
  });
});
