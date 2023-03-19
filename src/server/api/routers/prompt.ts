import { boolean, object, string, number } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
  order: number(),
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
  post: protectedProcedure
    .input(postPromptSchema)
    .mutation(({ ctx, input }) => {
      const { id } = input;

      if (id) {
        return ctx.prisma.prompt.update({
          where: { id },
          data: input,
        });
      } else {
        return ctx.prisma.prompt.create({
          data: { ...input, userId: ctx.session.user.id },
        });
      }
    }),
  getAllPromptsForConversation: protectedProcedure
    .input(getAllPromptsForConversationSchema)
    .query(({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { conversationId } = input;

      return prisma.prompt.findMany({
        where: { conversationId, userId: session.user.id },
      });
    }),
  delete: protectedProcedure
    .input(deletePromptSchema)
    .mutation(({ ctx, input }) => {
      const { id } = input;
      // TODO: Verify that the user requesting to delete prompt is authorized.
      return ctx.prisma.prompt.delete({ where: { id } });
    }),
});
