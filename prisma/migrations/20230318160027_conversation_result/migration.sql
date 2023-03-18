/*
  Warnings:

  - Added the required column `converstionId` to the `ConversationResult` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConversationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "converstionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    "conversationId" TEXT,
    CONSTRAINT "ConversationResult_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ConversationResult" ("createdAt", "id", "name", "result") SELECT "createdAt", "id", "name", "result" FROM "ConversationResult";
DROP TABLE "ConversationResult";
ALTER TABLE "new_ConversationResult" RENAME TO "ConversationResult";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
