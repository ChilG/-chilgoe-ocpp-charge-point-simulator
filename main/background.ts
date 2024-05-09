import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createServer, createWindow } from './helpers';
import http from 'http';
import { AppRouter, appRouter } from './api/root';
import { createTRPCContext } from './api/trpc';
import { error, info } from './logger';
import { dbUrl, schemaPath } from './constants';
import { checkNeedsMigrate, runPrismaCommand } from './prisma';
import * as trpcAdaptorExpress from '@trpc/server/adapters/express';
import * as trpcAdaptorWss from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let trpcServer: http.Server;
let wssServer: WebSocketServer;
let handler: ReturnType<typeof trpcAdaptorWss.applyWSSHandler<AppRouter>>;

const startTRPCServer = async () => {
  if (trpcServer) trpcServer.close();

  const app = createServer();

  const middleware = trpcAdaptorExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  });

  app.use('/api/trpc', middleware);

  trpcServer = app.listen(9988, '127.0.0.1', () => {
    info('TRPC Server Running On http://127.0.0.1:9988/api/trpc');
  });

  wssServer = new WebSocketServer({ server: trpcServer, path: '/ws/trpc' });

  handler = trpcAdaptorWss.applyWSSHandler<AppRouter>({
    wss: wssServer,
    router: appRouter,
    createContext: createTRPCContext,
  });

  wssServer.on('connection', (ws) => {
    !isProd && info(`➕➕ Connection (${wssServer.clients.size})`);
    ws.once('close', () => {
      !isProd && info(`➖➖ Connection (${wssServer.clients.size})`);
    });
  });
};

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1200,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    frame: false, // Remove window frame
    titleBarStyle: 'hiddenInset', // Hide title bar on macOS
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
  handler.broadcastReconnectNotification();
  wssServer.close();
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});
