-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChargePoint" (
    "chargePointId" TEXT NOT NULL PRIMARY KEY,
    "ocppProtocol" TEXT,
    "chargePointVendor" TEXT,
    "chargePointModel" TEXT,
    "chargePointSerialNumber" TEXT,
    "chargeBoxSerialNumber" TEXT,
    "firmwareVersion" TEXT,
    "iccid" TEXT,
    "imsi" TEXT,
    "meterType" TEXT,
    "meterSerialNumber" TEXT,
    "description" TEXT,
    "note" TEXT,
    "endPoint" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "simulationStatus" TEXT NOT NULL DEFAULT 'Stop'
);
INSERT INTO "new_ChargePoint" ("chargeBoxSerialNumber", "chargePointId", "chargePointModel", "chargePointSerialNumber", "chargePointVendor", "createdAt", "description", "endPoint", "firmwareVersion", "iccid", "imsi", "meterSerialNumber", "meterType", "note", "ocppProtocol", "updatedAt") SELECT "chargeBoxSerialNumber", "chargePointId", "chargePointModel", "chargePointSerialNumber", "chargePointVendor", "createdAt", "description", "endPoint", "firmwareVersion", "iccid", "imsi", "meterSerialNumber", "meterType", "note", "ocppProtocol", "updatedAt" FROM "ChargePoint";
DROP TABLE "ChargePoint";
ALTER TABLE "new_ChargePoint" RENAME TO "ChargePoint";
CREATE INDEX "ChargePoint_ocppProtocol_idx" ON "ChargePoint"("ocppProtocol");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
