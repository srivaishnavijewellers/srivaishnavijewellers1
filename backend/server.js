import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { seedDefaultSuperAdmin } from "./src/utils/seedDefaultSuperAdmin.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  await seedDefaultSuperAdmin();

  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

