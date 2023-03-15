import { boolean, object, string, z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const postPromptSchema = object({
  id: string().optional(),
  name: string({
    required_error: "Prompt name is required",
  }),
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
  post: publicProcedure.input(postPromptSchema).mutation(({ ctx, input }) => {
    const { text, isContextPrompt, conversationId, id, name } = input;

    if (id) {
      return ctx.prisma.prompt.update({
        where: { id },
        data: { text, isContextPrompt, conversationId, name },
      });
    } else {
      return ctx.prisma.prompt.create({
        data: { text, isContextPrompt, conversationId, name },
      });
    }
  }),
  getAllPromptsForConversation: publicProcedure
    .input(getAllPromptsForConversationSchema)
    .query(({ ctx, input }) => {
      const { prisma } = ctx;
      const { conversationId } = input;

      return prisma.prompt.findMany({ where: { conversationId } });
    }),
});
