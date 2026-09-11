/*
  Warnings:

  - You are about to alter the column `userId` on the `CartItem` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `userId` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("createdAt", "id", "productId", "quantity", "userId") SELECT "createdAt", "id", "productId", "quantity", "userId" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "status", "totalCents", "userId") SELECT "createdAt", "id", "status", "totalCents", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
