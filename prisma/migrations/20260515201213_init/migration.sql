-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "token" TEXT NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "validUntil" TEXT,
    "cumulative" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DiscountHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "cumulative" BOOLEAN NOT NULL,
    "validUntil" TEXT,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DiscountHistory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_token_key" ON "Business"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Business_email_key" ON "Business"("email");
