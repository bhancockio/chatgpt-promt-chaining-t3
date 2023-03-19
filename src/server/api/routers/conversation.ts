import { type Conversation } from "@prisma/client";
import { object, string } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const deleteConversationSchema = object({
  id: string({
    required_error: "Conversation id is required",
  }),
});

const createConversationSchema = object({
  name: string({
    required_error: "Conversation name is required",
  }),
});

const updateConversationSchema = object({
  id: string({
    required_error: "Conversation id is required",
  }),
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
  create: protectedProcedure
    .input(createConversationSchema)
    .mutation(({ ctx, input }) => {
      const { name } = input;
      const { session } = ctx;
      const userId = session.user.id;
      let newConveration: Conversation;

      return ctx.prisma.conversation
        .create({ data: { name, userId } })
        .then((conversation) => {
          newConveration = conversation;

          // Create the default prompt for the new conversation
          return ctx.prisma.prompt.create({
            data: {
              name: "New Prompt",
              text: "",
              isContextPrompt: true,
              conversationId: conversation.id,
              order: 0,
              userId: userId,
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
  update: protectedProcedure
    .input(updateConversationSchema)
    .mutation(({ ctx, input }) => {
      const { id, name } = input;
      // TODO: Verify that the user requesting to update conversation is authorized.
      return ctx.prisma.conversation.update({ where: { id }, data: { name } });
    }),
  getall: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.conversation.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  get: protectedProcedure
    .input(queryConversationSchema)
    .query(({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;
      // TODO: Verify that the user requesting to get conversation is authorized.
      return prisma.conversation.findUniqueOrThrow({
        where: { id: id },
      });
    }),
  delete: protectedProcedure
    .input(deleteConversationSchema)
    .mutation(({ ctx, input }) => {
      const { id } = input;
      // TODO: Verify that the user requesting to delete conversation is authorized.
      // Delete all cooresponding prompts for the conversation
      ctx.prisma.prompt
        .deleteMany({
          where: { conversationId: id },
        })
        .then(() => {
          console.log("successfully delete prompts for conversation", id);
          return ctx.prisma.conversation.delete({ where: { id: id } });
        })
        .then(() => {
          console.log("successfully delete conversation", id);
        })
        .catch((error) => {
          console.error(error);
        });
    }),
});
