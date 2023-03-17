/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Prompt } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db";
import { Configuration, OpenAIApi } from "openai";

interface ConversationRequest extends NextApiRequest {
  query: {
    conversationId: string;
  };
}

type OpenAPIPrompt = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default async function handler(
  req: ConversationRequest,
  res: NextApiResponse
) {
  const conversationId: string = req.query.conversationId;

  // Fetch data for conversation with given id from DB
  const prompts: Prompt[] = await prisma.prompt.findMany({
    where: { conversationId },
    orderBy: [{ order: "asc" }],
  });

  const promptValidationResults = isValidRequest(prompts);
  if (!promptValidationResults.isValidRequest) {
    return res
      .status(promptValidationResults.code || 400)
      .json(promptValidationResults.message);
  }

  // TODO: Convert all prompts into conversations
  // formatPromptsForOpenAI(prompts);

  //TODO: Send conversations to openai

  // TODO: return results

  return res.status(200).json({ prompts: prompts });
}

type validationResponse = {
  isValidRequest: boolean;
  message?: string;
  code?: number;
};

const isValidRequest = (prompts: Prompt[]): validationResponse => {
  // Verify that there are prompts associated with the conversation
  if (prompts.length === 0) {
    return {
      isValidRequest: false,
      message: "No prompts found for conversation",
      code: 404,
    };
  }

  // Verify that there is only one context prompt in the conversation
  const contextPromptCount: number = prompts.reduce(
    (acc: number, prompt: Prompt) => {
      return acc + (prompt.isContextPrompt ? 1 : 0);
    },
    0
  );
  if (contextPromptCount === 0) {
    return {
      isValidRequest: false,
      message: "A conversation must have at least one context prompt.",
      code: 400,
    };
  } else if (contextPromptCount > 1) {
    return {
      isValidRequest: false,
      message: "A conversation can only have one context prompt.",
      code: 400,
    };
  }

  // Verify that the first prompt is the context prompt
  if (!prompts[0]?.isContextPrompt) {
    return {
      isValidRequest: false,
      message: "The first prompt must be a context prompt.",
      code: 400,
    };
  }

  return { isValidRequest: true };
};

const formatPromptsForOpenAI = (prompts: Prompt[]) => {
  const conversation = [];

  return prompts;
};
