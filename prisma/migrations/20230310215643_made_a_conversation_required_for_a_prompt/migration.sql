/*
  Warnings:

  - Made the column `conversationId` on table `Prompt` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "previuosPromptId" INTEGER,
    "nextPromptId" INTEGER,
    "isContextPrompt" BOOLEAN NOT NULL DEFAULT false,
    "matrixParametersX" TEXT,
    "matrixParametersY" TEXT,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "Prompt_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prompt" ("conversationId", "id", "isContextPrompt", "matrixParametersX", "matrixParametersY", "nextPromptId", "previuosPromptId", "text") SELECT "conversationId", "id", "isContextPrompt", "matrixParametersX", "matrixParametersY", "nextPromptId", "previuosPromptId", "text" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
