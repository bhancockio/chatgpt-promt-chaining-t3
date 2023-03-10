import { type Conversation } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/utils/api";

function ConversationContainer() {
  const [currentConverastion, setCurrentConverastion] =
    useState<Conversation>();
  const [conversations, setConversations] = useState([]);
  const [prompts, setPrompts] = useState([]);

  const conversationMutation = api.conversation.create.useMutation({
    onSuccess: () => {
      console.log("Successfully created conversation");
    },
  });

  const createConversation = () => {
    conversationMutation.mutate({ name: "New Conversation" });
  };

  return (
    <div>
      <button onClick={createConversation}>Create Conversation</button>
      <p>
        Current Conversation:{" "}
        {currentConverastion
          ? currentConverastion.name
          : "No conversation currently selected"}
      </p>
    </div>
  );
}

export default ConversationContainer;
