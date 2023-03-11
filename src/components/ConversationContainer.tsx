import { type Prompt, type Conversation } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

function ConversationContainer({
  currentConversation,
}: {
  currentConversation: Conversation;
}) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  api.prompt.getAllPromptsForConversation.useQuery(
    { conversationId: currentConversation?.id || "" },
    {
      enabled: currentConversation?.id !== undefined,
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
  const promptMutation = api.prompt.create.useMutation({
    onSuccess: () => {
      console.log("Successfully created conversation");
    },
  });

  const createPrompt = () => {
    if (currentConversation) {
      promptMutation.mutate({
        text: "test",
        isContextPrompt: false,
        conversationId: currentConversation?.id,
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
          {currentConversation
            ? currentConversation.name
            : "No conversation currently selected"}
        </p>
        <button onClick={createPrompt}>Create Prompt</button>
      </div>
      <div></div>
    </div>
  );
}

export default ConversationContainer;
