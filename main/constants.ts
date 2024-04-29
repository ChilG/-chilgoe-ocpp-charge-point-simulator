import path from 'path';
import { app } from 'electron';

export const isDev = process.env.NODE_ENV === 'development';
export const dbPath = path.join(app.getPath('userData'), 'app.db');
export const dbUrl = isDev ? process.env.DATABASE_URL ?? 'file:./dev.db' : 'file:' + dbPath;

const platformName = (() => {
  const isDarwin = process.platform === 'darwin';
  if (isDarwin && process.arch === 'arm64') {
    return process.platform + 'Arm64';
  }

  return process.platform;
})();

const platformToExecutables: any = {
  win32: {
    queryEngine: 'node_modules/@prisma/engines/query_engine-windows.dll.node',
    schemaEngine: 'node_modules/@prisma/engines/schema-engine-windows.exe',
  },
  darwin: {
    queryEngine: 'node_modules/@prisma/engines/libquery_engine-darwin.dylib.node',
    schemaEngine: 'node_modules/@prisma/engines/schema-engine-darwin',
  },
  darwinArm64: {
    queryEngine: 'node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node',
    schemaEngine: 'node_modules/@prisma/engines/schema-engine-darwin-arm64',
  },
};

const extraResourcesPath = app.getAppPath().replace('app.asar', ''); // impacted by extraResources setting in electron-builder.yml
const unpackResourcesPath = app.getAppPath().replace('app.asar', 'app.asar.unpacked');

export const qePath = path.join(extraResourcesPath, platformToExecutables[platformName].queryEngine);
export const sePath = path.join(extraResourcesPath, platformToExecutables[platformName].schemaEngine);
export const prismaPath = path.join(app.getAppPath(), 'node_modules/prisma/build/index.js');
export const schemaPath = path.join(unpackResourcesPath, 'prisma', 'schema.prisma');

export const latestMigration = '20240429102705_update_database';

export interface Migration {
  id: string;
  checksum: string;
  finished_at: string;
  migration_name: string;
  logs: string;
  rolled_back_at: string;
  started_at: string;
  applied_steps_count: string;
}
