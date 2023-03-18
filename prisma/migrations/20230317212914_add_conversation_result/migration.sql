/*
  Warnings:

  - You are about to drop the column `nextPromptId` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `previuosPromptId` on the `Prompt` table. All the data in the column will be lost.
  - Added the required column `order` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ConversationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'New Prompt',
    "isContextPrompt" BOOLEAN NOT NULL DEFAULT false,
    "matrixParametersX" TEXT,
    "matrixParametersY" TEXT,
    "conversationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Prompt_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prompt" ("conversationId", "createdAt", "id", "isContextPrompt", "matrixParametersX", "matrixParametersY", "name", "text", "updatedAt") SELECT "conversationId", "createdAt", "id", "isContextPrompt", "matrixParametersX", "matrixParametersY", "name", "text", "updatedAt" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
