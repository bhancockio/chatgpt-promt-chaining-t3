/*
  Warnings:

  - Made the column `conversationId` on table `ConversationResult` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConversationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'New Conversation Result',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "ConversationResult_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ConversationResult" ("conversationId", "createdAt", "id", "name", "result") SELECT "conversationId", "createdAt", "id", "name", "result" FROM "ConversationResult";
DROP TABLE "ConversationResult";
ALTER TABLE "new_ConversationResult" RENAME TO "ConversationResult";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
