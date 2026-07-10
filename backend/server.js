import { app } from './app.js';
import { PORT } from './config/env.js';
import connectDB from './config/db.js';

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch {
  process.exit(1);
}
