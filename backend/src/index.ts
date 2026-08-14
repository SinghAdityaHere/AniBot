import { app } from './app';
import { config } from './config';

app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 AniBot Backend Server running on http://127.0.0.1:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
