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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Connector" (
    "connectorId" INTEGER NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "status" TEXT,
    "statusTimestamp" DATETIME,
    "errorCode" TEXT,
    "errorInfo" TEXT,
    "vendorId" TEXT,
    "vendorErrorCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("chargePointId", "connectorId"),
    CONSTRAINT "Connector_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Configuration" (
    "key" TEXT NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "readonly" BOOLEAN NOT NULL DEFAULT true,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("chargePointId", "key"),
    CONSTRAINT "Configuration_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "OcppTag" (
    "idTag" TEXT NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "parentIdTag" TEXT,
    "expiryDate" DATETIME,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    PRIMARY KEY ("chargePointId", "idTag"),
    CONSTRAINT "OcppTag_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" INTEGER NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "idTag" TEXT NOT NULL,
    "startTimestamp" DATETIME,
    "meterStart" INTEGER,
    "stopTimestamp" DATETIME,
    "meterStop" INTEGER,
    "stopReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("chargePointId", "transactionId"),
    CONSTRAINT "Transaction_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Transaction_chargePointId_connectorId_fkey" FOREIGN KEY ("chargePointId", "connectorId") REFERENCES "Connector" ("chargePointId", "connectorId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Transaction_chargePointId_idTag_fkey" FOREIGN KEY ("chargePointId", "idTag") REFERENCES "OcppTag" ("chargePointId", "idTag") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Reservation" (
    "reservationId" INTEGER NOT NULL,
    "chargePointId" TEXT NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "idTag" TEXT NOT NULL,
    "transactionId" INTEGER,
    "expiryDatetime" DATETIME NOT NULL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("chargePointId", "reservationId"),
    CONSTRAINT "Reservation_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Reservation_chargePointId_transactionId_fkey" FOREIGN KEY ("chargePointId", "transactionId") REFERENCES "Transaction" ("chargePointId", "transactionId") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Reservation_chargePointId_connectorId_fkey" FOREIGN KEY ("chargePointId", "connectorId") REFERENCES "Connector" ("chargePointId", "connectorId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Reservation_chargePointId_idTag_fkey" FOREIGN KEY ("chargePointId", "idTag") REFERENCES "OcppTag" ("chargePointId", "idTag") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "ChargingProfile" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("chargePointId", "chargingProfileId", "connectorId"),
    CONSTRAINT "ChargingProfile_chargePointId_fkey" FOREIGN KEY ("chargePointId") REFERENCES "ChargePoint" ("chargePointId") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "ChargingProfile_chargePointId_connectorId_fkey" FOREIGN KEY ("chargePointId", "connectorId") REFERENCES "Connector" ("chargePointId", "connectorId") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "ChargePoint_chargePointId_key" ON "ChargePoint"("chargePointId");

-- CreateIndex
CREATE INDEX "ChargePoint_ocppProtocol_idx" ON "ChargePoint"("ocppProtocol");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_transactionId_key" ON "Reservation"("transactionId");
