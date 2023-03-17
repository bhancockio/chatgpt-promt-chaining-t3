import { type Conversation } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";

import ConversationSidebarCell from "./ConversationSidebarCell";

function ConversationSidebar({
  conversations,
  setCurrentConversation,
  setConversations,
  currentConversation,
}: {
  conversations: Conversation[];
  setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>;
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  currentConversation: Conversation | null;
}) {
  const conversationMutation = api.conversation.create.useMutation({
    onSuccess: (resp) => {
      if (resp) {
        setCurrentConversation(resp);
        setConversations((c) => c.concat(resp));
      } else {
        setCurrentConversation(null);
      }
    },
    onError: (error) => {
      console.error(error);
      setCurrentConversation(null);
    },
  });
  const createConversation = () => {
    conversationMutation.mutate({
      name: "New Conversation",
    });
  };

  return (
    <div className="dark flex h-screen flex-col bg-gray-800 p-2 text-sm text-gray-100">
      <button
        onClick={createConversation}
        className="mb-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-white/20 py-3 px-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
      >
        + New Conversation
      </button>
      {conversations.length === 0 ? (
        <p>No Conversations. Start a new one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((conversation) => (
            <ConversationSidebarCell
              key={conversation.id}
              conversation={conversation}
              setConversations={setConversations}
              setCurrentConversation={setCurrentConversation}
              isCurrentConversation={
                conversation.id === currentConversation?.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ConversationSidebar;
