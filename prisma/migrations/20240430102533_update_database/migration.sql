-- CreateTable
CREATE TABLE "ChargePoint" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Connector" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "connectorId" INTEGER NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "status" TEXT,
    "errorCode" TEXT,
    "errorInfo" TEXT,
    "vendorId" TEXT,
    "vendorErrorCode" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Connector_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "readonly" BOOLEAN NOT NULL DEFAULT true,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Configuration_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "OcppTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idTag" TEXT NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "parentIdTag" TEXT,
    "expiryDate" DATETIME,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OcppTag_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transactionId" INTEGER NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "reservation" INTEGER,
    "idTag" TEXT NOT NULL,
    "startTimestamp" DATETIME,
    "meterStart" INTEGER,
    "stopTimestamp" DATETIME,
    "meterStop" INTEGER,
    "stopReason" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Transaction_chargePointId_connectorId_fkey" FOREIGN KEY ("chargePointId", "connectorId") REFERENCES "Connector" ("chargePointId", "connectorId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Transaction_chargePointId_idTag_fkey" FOREIGN KEY ("chargePointId", "idTag") REFERENCES "OcppTag" ("chargePointId", "idTag") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Transaction_reservation_fkey" FOREIGN KEY ("reservation") REFERENCES "Reservation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationId" INTEGER NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "idTag" TEXT NOT NULL,
    "expiryDatetime" DATETIME NOT NULL,
    "status" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_chargePointId_connectorId_fkey" FOREIGN KEY ("chargePointId", "connectorId") REFERENCES "Connector" ("chargePointId", "connectorId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Reservation_chargePointId_idTag_fkey" FOREIGN KEY ("chargePointId", "idTag") REFERENCES "OcppTag" ("chargePointId", "idTag") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Reservation_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChargingProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chargingProfileId" INTEGER NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "stackLevel" INTEGER NOT NULL,
    "chargingProfilePurpose" TEXT NOT NULL,
    "chargingProfileKind" TEXT NOT NULL,
    "recurrencyKind" TEXT,
    "validFrom" DATETIME,
    "validTo" DATETIME,
    "duration" INTEGER,
    "startSchedule" DATETIME,
    "chargingRateUnit" TEXT NOT NULL,
    "minChargingRate" DECIMAL DEFAULT 0.0,
    "chargingSchedulePeriod" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChargingProfile_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "ChargingProfile_chargePointId_connectorId_fkey" FOREIGN KEY ("chargePointId", "connectorId") REFERENCES "Connector" ("chargePointId", "connectorId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uniqueId" TEXT NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "action" TEXT,
    "request" TEXT,
    "response" TEXT,
    "errorCode" TEXT,
    "errorDescription" TEXT,
    "errorDetails" TEXT,
    "requestTimestamp" DATETIME,
    "responseTimestamp" DATETIME,
    "errorTimestamp" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE INDEX "ChargePoint_ocppProtocol_idx" ON "ChargePoint"("ocppProtocol");

-- CreateIndex
CREATE UNIQUE INDEX "Connector_chargePointId_connectorId_key" ON "Connector"("chargePointId", "connectorId");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_chargePointId_key_key" ON "Configuration"("chargePointId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "OcppTag_chargePointId_idTag_key" ON "OcppTag"("chargePointId", "idTag");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reservation_key" ON "Transaction"("reservation");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_chargePointId_transactionId_key" ON "Transaction"("chargePointId", "transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationId_connectorId_chargePointId_key" ON "Reservation"("reservationId", "connectorId", "chargePointId");

-- CreateIndex
CREATE UNIQUE INDEX "ChargingProfile_chargePointId_chargingProfileId_connectorId_key" ON "ChargingProfile"("chargePointId", "chargingProfileId", "connectorId");

-- CreateIndex
CREATE INDEX "Log_action_idx" ON "Log"("action");

-- CreateIndex
CREATE INDEX "Log_requestTimestamp_idx" ON "Log"("requestTimestamp");

-- CreateIndex
CREATE INDEX "Log_responseTimestamp_idx" ON "Log"("responseTimestamp");

-- CreateIndex
CREATE INDEX "Log_errorTimestamp_idx" ON "Log"("errorTimestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Log_uniqueId_chargePointId_key" ON "Log"("uniqueId", "chargePointId");
