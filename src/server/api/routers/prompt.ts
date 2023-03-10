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

export const promptRouter = createTRPCRouter({
  create: publicProcedure
    .input(createPromptSchema)
    .mutation(({ ctx, input }) => {
      const { text, isContextPrompt, conversationId } = input;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return ctx.prisma.prompt.create({
        data: { text, isContextPrompt, conversationId },
      });
    }),
});
