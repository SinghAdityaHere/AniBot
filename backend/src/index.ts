import { app } from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`🚀 AniBot Backend Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
