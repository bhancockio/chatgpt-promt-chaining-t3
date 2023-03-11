import { type Prompt, type Conversation } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

function ConversationContainer() {
  const [currentConverastion, setCurrentConverastion] =
    useState<Conversation>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  api.conversation.getall.useQuery(undefined, {
    onSuccess: (resp) => {
      setConversations(resp);
    },
    onError: (error) => {
      setConversations([]);
      console.error(error);
    },
  });

  api.prompt.getAllPromptsForConversation.useQuery(
    { conversationId: currentConverastion?.id || "" },
    {
      enabled: currentConverastion?.id !== undefined,
      onSuccess: (resp) => {
        console.log("resp", resp);
        setPrompts(resp);
      },
      onError: (error) => {
        console.error(error);
        setPrompts([]);
      },
    }
  );

  useEffect(() => {
    if (conversations.length > 0) {
      setCurrentConverastion(conversations[0]);
    }
  }, [conversations, setCurrentConverastion]);

  const promptMutation = api.prompt.create.useMutation({
    onSuccess: () => {
      console.log("Successfully created conversation");
    },
  });

  const conversationMutation = api.conversation.create.useMutation({
    onSuccess: () => {
      console.log("Successfully created conversation");
    },
  });

  const createConversation = () => {
    conversationMutation.mutate({ name: "New Conversation" });
  };

  const createPrompt = () => {
    if (currentConverastion) {
      promptMutation.mutate({
        text: "test",
        isContextPrompt: false,
        conversationId: currentConverastion?.id,
      });
    }
  };

  return (
    <div
      className="flex flex-col
    "
    >
      <div className="flex flex-row">
        <p>
          Current Conversation:{" "}
          {currentConverastion
            ? currentConverastion.name
            : "No conversation currently selected"}
        </p>
        <button onClick={createConversation}>Create Conversation</button>
        <button onClick={createPrompt}>Create Prompt</button>
      </div>
      <div></div>
    </div>
  );
}

export default ConversationContainer;
