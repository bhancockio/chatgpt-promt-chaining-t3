import { boolean, object, string, number } from "zod";

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
  matrixParametersX: string().optional(),
  matrixParametersY: string().optional(),
  order: number().default(1),
});

const deletePromptSchema = object({
  id: string(),
});

const getAllPromptsForConversationSchema = object({
  conversationId: string({
    required_error: "Conversation ID is required",
  }),
});

export const promptRouter = createTRPCRouter({
  post: publicProcedure.input(postPromptSchema).mutation(({ ctx, input }) => {
    const {
      text,
      isContextPrompt,
      conversationId,
      id,
      name,
      order,
      matrixParametersX,
      matrixParametersY,
    } = input;

    if (id) {
      return ctx.prisma.prompt.update({
        where: { id },
        data: {
          text,
          isContextPrompt,
          conversationId,
          name,
          order,
          matrixParametersX,
          matrixParametersY,
        },
      });
    } else {
      return ctx.prisma.prompt.create({
        data: {
          text,
          isContextPrompt,
          conversationId,
          name,
          order,
          matrixParametersX,
          matrixParametersY,
        },
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
  delete: publicProcedure
    .input(deletePromptSchema)
    .mutation(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.prompt.delete({ where: { id } });
    }),
});
