-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_businessId_viewedAt_idx" ON "PageView"("businessId", "viewedAt");

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
