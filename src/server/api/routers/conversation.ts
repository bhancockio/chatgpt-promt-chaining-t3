import { object, string } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createConversationSchema = object({
  name: string({
    required_error: "Conversation text is required",
  }),
});

export const conversationRouter = createTRPCRouter({
  create: publicProcedure
    .input(createConversationSchema)
    .mutation(({ ctx, input }) => {
      const { name } = input;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return ctx.prisma.conversation.create({ data: { name } });
    }),
});
