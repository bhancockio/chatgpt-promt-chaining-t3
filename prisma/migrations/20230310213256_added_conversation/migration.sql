-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

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
    "conversationId" TEXT,
    CONSTRAINT "Prompt_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Prompt" ("id", "isContextPrompt", "matrixParametersX", "matrixParametersY", "nextPromptId", "previuosPromptId", "text") SELECT "id", "isContextPrompt", "matrixParametersX", "matrixParametersY", "nextPromptId", "previuosPromptId", "text" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
