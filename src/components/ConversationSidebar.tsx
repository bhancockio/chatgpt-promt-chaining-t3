import { type Conversation } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";

function ConversationSidebar({
  conversations,
  setCurrentConversation,
  setConversations,
}: {
  conversations: Conversation[];
  setCurrentConversation: Dispatch<SetStateAction<Conversation | undefined>>;
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
}) {
  const conversationMutation = api.conversation.create.useMutation({
    onSuccess: (resp) => {
      console.log("Successfully created conversation", resp);
      if (resp) {
        setCurrentConversation(resp);
        setConversations((c) => c.concat(resp));
      } else {
        setCurrentConversation(undefined);
      }
    },
    onError: (error) => {
      console.error(error);
      setCurrentConversation(undefined);
    },
  });
  const createConversation = () => {
    conversationMutation.mutate({
      name: `New Conversation ${Date().toString()}`,
    });
  };

  return (
    <div className="dark flex h-screen flex-col bg-gray-800 p-2 text-sm text-gray-100">
      <button
        onClick={createConversation}
        className="mb-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-white/20 py-3 px-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
      >
        + New Chat
      </button>
      {conversations.length === 0 ? (
        <p>No Conversations. Start a new one.</p>
      ) : (
        <div className="flex flex-col gap-2 ">
          {conversations.map((conversation) => (
            <a
              className="group relative flex cursor-pointer items-center gap-3 break-all rounded-md bg-gray-800 py-3 px-3 pr-14 hover:bg-gray-800"
              key={conversation.id}
              onClick={() => setCurrentConversation(conversation)}
            >
              {conversation.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConversationSidebar;
