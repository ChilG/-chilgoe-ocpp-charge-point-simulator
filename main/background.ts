import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createServer, createWindow } from './helpers';
import * as trpcExpress from '@trpc/server/adapters/express';
import http from 'http';
import { appRouter } from './api/root';
import { createTRPCContext } from './api/trpc';
import { error, info } from './logger';
import { dbUrl, schemaPath } from './constants';
import { checkNeedsMigrate, runPrismaCommand } from './prisma';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let trpcServer: http.Server;

const startTRPCServer = async () => {
  if (trpcServer) trpcServer.close();

  const app = createServer();

  const middleware = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  });

  app.use('/api/trpc', middleware);

  trpcServer = app.listen(9988, '127.0.0.1', () => {
    info('TRPC Server Running On http://127.0.0.1:9988/api/trpc');
  });
};

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  const needsMigration = await checkNeedsMigrate();

  mainWindow.webContents.send('prisma-migrate-log', { message: { needsMigration } });

  if (needsMigration) {
    try {
      await runPrismaCommand({
        command: ['migrate', 'deploy', '--schema', schemaPath],
        dbUrl,
        windows: mainWindow,
      });
      info('Migration done.');
    } catch (e) {
      mainWindow.webContents.send('prisma-migrate-log', { message: e });
      error(e);
      process.exit(1);
    }
  } else {
    info('Does not need migration');
  }
})();

app.on('ready', async () => {
  await startTRPCServer();
});

app.on('window-all-closed', () => {
  trpcServer.close();
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});
