import { PrismaClient } from '../prisma/generated/prisma-client-js';
import { dbPath, dbUrl, latestMigration, Migration, prismaPath, qePath, sePath } from './constants';
import { BrowserWindow } from 'electron';
import { fork } from 'child_process';
import { error, info } from './logger';
import * as fs from 'fs';

export const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
  datasources: { db: { url: dbUrl } },
});

export async function runPrismaCommand({
  command,
  dbUrl,
  windows,
}: {
  command: string[];
  dbUrl: string;
  windows: BrowserWindow;
}): Promise<number> {
  info(`Query engine path ${qePath}`);

  try {
    const exitCode = await new Promise((resolve, _) => {
      info(`Prisma path ${prismaPath}`);

      const child = fork(prismaPath, command, {
        env: {
          ...process.env,
          DATABASE_URL: dbUrl,
          PRISMA_QUERY_ENGINE_LIBRARY: qePath,
          PRISMA_INTROSPECTION_ENGINE_BINARY: qePath,
          PRISMA_SCHEMA_ENGINE_BINARY: sePath,
        },
        stdio: 'pipe',
      });

      child.on('message', (msg) => {
        info(msg.toString());
        windows.webContents.send('prisma-migrate-log', { message: msg.toString() });
      });

      child.on('error', (err) => {
        error(`Child process got error:${err}`);
        windows.webContents.send('prisma-migrate-log', { message: `Child process got error:${err}` });
      });

      child.on('close', (code, signal) => {
        windows.webContents.send('prisma-migrate-log', { message: `resolve(code)`, code: code });
        resolve(code);
      });

      child.stdout?.on('data', function (data) {
        info(`prisma: ${data.toString()}`);
        windows.webContents.send('prisma-migrate-log', { message: `prisma: ${data.toString()}` });
      });

      child.stderr?.on('data', function (data) {
        error(`prisma: ${data.toString()}`);
        windows.webContents.send('prisma-migrate-log', { message: `prisma: ${data.toString()}` });
      });
    });

    if (exitCode !== 0) throw Error(`command ${command} failed with exit code ${exitCode}`);

    return exitCode;
  } catch (e) {
    error(e.toString());
    throw e;
  }
}

export async function checkNeedsMigrate() {
  let needsMigration: boolean;
  const dbExists = fs.existsSync(dbPath);
  if (!dbExists) {
    needsMigration = true;
    // prisma for whatever reason has trouble if the database file does not exist yet.
    // So just touch it here
    fs.closeSync(fs.openSync(dbPath, 'w'));
  } else {
    try {
      const latest: Migration[] = await prisma.$queryRaw`select * from _prisma_migrations order by finished_at`;
      needsMigration = latest[latest.length - 1]?.migration_name !== latestMigration;
    } catch (e) {
      error(e);
      needsMigration = true;
    }
  }
  return needsMigration;
}
