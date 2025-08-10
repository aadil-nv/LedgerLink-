// backend/src/server.ts
import { config } from './config/env';
import createApp from './app';
import { connectMongo } from './config/db';
import { connectRedis } from './config/redis';
import { logger } from './config/logger';
import { AddressInfo } from 'net';

async function start(): Promise<void> {
  try {
    await connectMongo();
    await connectRedis();

    const app = createApp();

    const server = app.listen(Number(config.PORT), () => {
      const address = server.address() as AddressInfo;
      logger.info(`Server listening on port ${address.port}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error({ err }, 'Failed to start server');
    } else {
      logger.error({ err: String(err) }, 'Failed to start server');
    }
    process.exit(1);
  }
}

start();
