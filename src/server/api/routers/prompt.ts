import { boolean, object, string, z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createPromptSchema = object({
  text: string({
    required_error: "Prompt text is required",
  }),
  isContextPrompt: boolean().default(false),
  conversationId: string({
    required_error: "Conversation ID text is required",
  }),
});

const getAllPromptsForConversationSchema = object({
  conversationId: string({
    required_error: "Conversation ID is required",
  }),
});

export const promptRouter = createTRPCRouter({
  create: publicProcedure
    .input(createPromptSchema)
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;
      const { text, isContextPrompt, conversationId } = input;

      return prisma.prompt.create({
        data: { text, isContextPrompt, conversationId },
      });
    }),
  getAllPromptsForConversation: publicProcedure
    .input(getAllPromptsForConversationSchema)
    .query(({ ctx, input }) => {
      const { prisma } = ctx;
      const { conversationId } = input;

      return prisma.prompt.findMany({ where: { conversationId } });
    }),
});
