import { type Conversation } from "@prisma/client";
import { useState, useContext } from "react";
import { api } from "~/utils/api";
import { BsPencil, BsTrash, BsCheck } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import {
  ConversationContext,
  type ConversationContextType,
} from "~/context/conversationContext";

function ConversationSidebarCell({
  conversation,
  isCurrentConversation,
}: {
  conversation: Conversation;
  isCurrentConversation: boolean;
}) {
  const { setCurrentConversation, setConversations } = useContext(
    ConversationContext
  ) as ConversationContextType;
  const [isEditState, setIsEditState] = useState(false);
  const [isDeleteState, setIsDeleteState] = useState(false);
  const [newConversationName, setNewConversationName] = useState<string>("");

  const updateConversationMutation = api.conversation.update.useMutation({
    onSuccess: (updatedConversation: Conversation) => {
      setConversations((conversations) =>
        conversations.map((conversation) => {
          if (conversation.id === updatedConversation.id) {
            return updatedConversation;
          }
          return conversation;
        })
      );
    },
    onError: (error) => {
      console.error("Error updating conversation");
      console.error(error);
    },
  });

  const deleteConversationMutation = api.conversation.delete.useMutation({
    onSuccess: (success) => {
      console.log(success);
    },
    onError: (error) => {
      console.error("Error deleting conversation");
      console.error(error);
    },
  });

  const updateConversationName = () => {
    setIsEditState((editState) => !editState);
    updateConversationMutation.mutate({
      id: conversation.id,
      name: newConversationName,
    });
  };

  const deleteConversation = () => {
    deleteConversationMutation.mutate({ id: conversation.id });
  };

  return (
    <div
      key={conversation.id}
      className="flex flex-row items-center justify-between bg-gray-800 hover:bg-gray-500/10"
      onClick={() => setCurrentConversation(conversation)}
    >
      {isEditState && (
        <input
          className="ml-2 min-h-[44px] rounded-md border-2 border-blue-500 bg-transparent text-white"
          defaultValue={conversation.name}
          onChange={(e) => setNewConversationName(e.target.value)}
        />
      )}
      {isDeleteState && (
        <div className="group relative flex cursor-pointer items-center gap-3 rounded-md  py-3 px-3 pr-14 ">
          Delete {conversation.name}?
        </div>
      )}

      {!isDeleteState && !isEditState && (
        <a className="group relative flex cursor-pointer items-center gap-3 rounded-md py-3 px-3 pr-14 ">
          {conversation.name}
        </a>
      )}

      {conversation && (
        <div className="flex flex-row gap-2">
          {isEditState && (
            <>
              <BsCheck
                className="text-gray-400 hover:text-white"
                onClick={updateConversationName}
              />
              <MdOutlineCancel
                onClick={() => setIsEditState(() => false)}
                className="text-gray-400 hover:text-white"
              />
            </>
          )}
          {isDeleteState && (
            <>
              <BsCheck
                className="text-gray-400 hover:text-white"
                onClick={deleteConversation}
              />
              <MdOutlineCancel
                onClick={() => setIsDeleteState(() => false)}
                className="text-gray-400 hover:text-white"
              />
            </>
          )}
          {!isDeleteState && !isEditState && (
            <>
              <BsPencil
                className="text-gray-400 hover:text-white"
                onClick={() => setIsEditState((editState) => !editState)}
              />
              <BsTrash
                onClick={() => setIsDeleteState(() => true)}
                className="text-gray-400 hover:text-white"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ConversationSidebarCell;
