/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Prompt } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import { object, string } from "zod";

const requestBodySchema = object({
  conversationId: string({
    required_error: "Conversation ID required.",
  }),
  userId: string({
    required_error: "User ID required.",
  }),
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type OpenAPIConversation = {
  prompts: ChatCompletionRequestMessage[];
};

const X_PARAMETER_KEY = "{X}";
const Y_PARAMETER_KEY = "{Y}";
const CONVERSATION_SEPARATOR = "------------";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let conversationId, userId;
  try {
    const data = requestBodySchema.parse(req.body);
    conversationId = data.conversationId;
    userId = data.userId;
  } catch (error) {
    console.error("Error parsing request body");
    console.error(error);
    return res.status(400).json({ message: error });
  }

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

  // Convert all prompts into chatGPT conversations
  const conversations = formatPromptsForOpenAI(prompts);

  // Send conversations to openai
  const results = await executeAllConversations(conversations);

  // Save the results
  const savedConversationResult = await saveConversationResult(
    results,
    conversationId,
    userId
  );

  // return results
  return res.status(200).json(savedConversationResult);
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

  // Validate X and Y parameters in prompts
  for (const prompt of prompts) {
    const xMatrixValidation = isValidMatrixParameter(
      prompt.matrixParametersX || "",
      X_PARAMETER_KEY,
      prompt.text
    );

    const yMatrixValidation = isValidMatrixParameter(
      prompt.matrixParametersY || "",
      Y_PARAMETER_KEY,
      prompt.text
    );

    if (!xMatrixValidation.isValidRequest) {
      return xMatrixValidation;
    }
    if (!yMatrixValidation.isValidRequest) {
      return yMatrixValidation;
    }
  }

  return { isValidRequest: true };
};

const isValidMatrixParameter = (
  parameters: string,
  key: string,
  prompt: string
) => {
  // If the user didn't include parameters, we can skip the validation.
  if (parameters.length === 0) {
    return {
      isValidRequest: true,
    };
  }

  // Did the user include the key in their prompt
  if (!prompt.includes(key)) {
    return {
      isValidRequest: false,
      message: `To use your parameters (${parameters}) you need to include ${key} in your prompt.`,
      code: 400,
    };
  }

  return { isValidRequest: true };
};

const formatPromptsForOpenAI = (prompts: Prompt[]) => {
  let conversations: OpenAPIConversation[] = [];

  for (const prompt of prompts) {
    // If there are not any conversations, we need to create the first one
    if (conversations.length === 0) {
      const conversation: OpenAPIConversation = {
        prompts: [],
      };
      conversations.push(conversation);
    }

    if (prompt.isContextPrompt) {
      for (const conversation of conversations) {
        conversation.prompts.push({
          content: prompt.text,
          role: "system",
        });
      }
    } else {
      const { text, matrixParametersX, matrixParametersY } = prompt;
      const messages: string[] = createPromptsBasedOnParameters(
        text,
        matrixParametersX || "",
        matrixParametersY || ""
      );
      const newConversations: OpenAPIConversation[] = [];

      for (const message of messages) {
        for (const conversation of conversations) {
          const newConversation = JSON.parse(
            JSON.stringify(conversation)
          ) as OpenAPIConversation;
          newConversation.prompts.push({
            role: "user",
            content: message,
          });
          newConversations.push(newConversation);
        }
      }
      conversations = newConversations;
    }
  }

  return conversations;
};

const createPromptsBasedOnParameters = (
  text: string,
  xParameters: string,
  yParameters: string
): string[] => {
  const messages: string[] = [];
  // Case 1: The user doesn't include X or Y parameters
  if (xParameters.length === 0 && yParameters.length === 0) {
    messages.push(text);
  }
  // Case 2: The user only includes X parameters
  else if (xParameters.length !== 0) {
    for (const x of xParameters.split(",")) {
      if (x === "") {
        continue;
      }
      const newMessage = text.replace(X_PARAMETER_KEY, x);
      messages.push(newMessage);
    }
  }
  // Case 3: The user only includes Y parameters
  else if (yParameters.length !== 0) {
    for (const y of yParameters.split(",")) {
      if (y === "") {
        continue;
      }
      const newMessage = text.replace(Y_PARAMETER_KEY, y);
      messages.push(newMessage);
    }
  }
  // Case 4: The user includes X & Y parameters
  else {
    for (const x of xParameters.split(",")) {
      for (const y of yParameters.split(",")) {
        if (x === "" || y === "") {
          continue;
        }
        const newMessage = text
          .replace(X_PARAMETER_KEY, x)
          .replace(Y_PARAMETER_KEY, y);
        messages.push(newMessage);
      }
    }
  }

  return messages;
};

const executeAllConversations = async (
  conversations: OpenAPIConversation[]
) => {
  let finalResult = "";
  for (const conversation of conversations) {
    const messages: ChatCompletionRequestMessage[] = [];
    for (const prompt of conversation.prompts) {
      messages.push(prompt);
      try {
        const completion = await openai.createChatCompletion({
          messages: messages,
          model: "gpt-3.5-turbo",
        });
        const message = completion.data.choices[0]?.message;
        if (message) {
          messages.push(message);
        } else {
          throw new Error("Open AI didn't respond with a message.", message);
        }
      } catch (error) {
        console.error("Error with OpenAI API");
        console.error(error);
      }
    }

    // Grab final response
    const lastmessage = messages[messages.length - 1]?.content || "";
    finalResult = finalResult.concat(lastmessage, CONVERSATION_SEPARATOR);
  }
  return finalResult;
};

const saveConversationResult = (
  result: string,
  conversationId: string,
  userId: string
) => {
  return prisma.conversationResult.create({
    data: { conversationId, result, userId },
  });
};
