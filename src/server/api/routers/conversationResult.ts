/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { object, string } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createConversationResultSchema = object({
  conversationId: string({
    required_error: "Conversation Id is required",
  }),
  result: string({
    required_error: "Conversation result is required",
  }),
});

const updateConversationResultSchema = object({
  id: string({
    required_error: "Conversation Result Id is required",
  }),
  name: string({
    required_error: "Conversation Result name is required",
  }),
});

const getConversationResultsSchema = object({
  conversationId: string({
    required_error: "Conversation Id is required",
  }),
});

const deleteConversationResultSchema = object({
  id: string({
    required_error: "Id is required",
  }),
});
const deleteConversationResultsForConversationSchema = object({
  conversationId: string({
    required_error: "Conversation Id is required",
  }),
});

export const conversationResultRouter = createTRPCRouter({
  create: publicProcedure
    .input(createConversationResultSchema)
    .mutation(({ ctx, input }) => {
      const { conversationId, result } = input;

      return ctx.prisma.conversationResult.create({
        data: { conversationId, result },
      });
    }),
  update: publicProcedure
    .input(updateConversationResultSchema)
    .mutation(({ ctx, input }) => {
      const { id, name, result } = input;

      return ctx.prisma.conversationResult.update({
        where: { id },
        data: { name, result },
      });
    }),
  getAllResultsForConversation: publicProcedure
    .input(getConversationResultsSchema)
    .query(({ ctx, input }) => {
      const { conversationId } = input;

      return ctx.prisma.conversationResult.findMany({
        where: { conversationId },
        orderBy: [{ createdAt: "desc" }],
      });
    }),
  delete: publicProcedure
    .input(deleteConversationResultSchema)
    .mutation(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.conversationResult.delete({ where: { id } });
    }),
  deleteAllResultsForConversation: publicProcedure
    .input(deleteConversationResultsForConversationSchema)
    .mutation(({ ctx, input }) => {
      const { conversationId } = input;

      return ctx.prisma.conversationResult.deleteMany({
        where: { conversationId },
      });
    }),
});
