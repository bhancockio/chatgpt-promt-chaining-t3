import { type Conversation } from "@prisma/client";
import { object, string } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createConversationSchema = object({
  name: string({
    required_error: "Conversation name is required",
  }),
});

const queryConversationSchema = object({
  id: string({
    required_error: "Prompt ID required",
  }),
});

export const conversationRouter = createTRPCRouter({
  create: publicProcedure
    .input(createConversationSchema)
    .mutation(({ ctx, input }) => {
      const { name } = input;
      let newConveration: Conversation;

      return ctx.prisma.conversation
        .create({ data: { name } })
        .then((conversation) => {
          console.log("Conversation", conversation);
          newConveration = conversation;

          // Create the default prompt for the new conversation
          return ctx.prisma.prompt.create({
            data: {
              name: "New Prompt",
              text: "",
              isContextPrompt: true,
              conversationId: conversation.id,
            },
          });
        })
        .then(() => {
          return newConveration;
        })
        .catch((error) => {
          console.error("Error creating new conversation");
          console.error(error);
          return null;
        });
    }),
  getall: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.conversation.findMany();
  }),
  get: publicProcedure
    .input(queryConversationSchema)
    .query(({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      return prisma.conversation.findUniqueOrThrow({
        where: { id: id },
      });
    }),
});
