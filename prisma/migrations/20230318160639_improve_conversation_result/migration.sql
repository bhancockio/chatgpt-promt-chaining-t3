/*
  Warnings:

  - You are about to drop the column `converstionId` on the `ConversationResult` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConversationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'New Conversation Result',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    "conversationId" TEXT,
    CONSTRAINT "ConversationResult_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ConversationResult" ("conversationId", "createdAt", "id", "name", "result") SELECT "conversationId", "createdAt", "id", "name", "result" FROM "ConversationResult";
DROP TABLE "ConversationResult";
ALTER TABLE "new_ConversationResult" RENAME TO "ConversationResult";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
