/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type Prompt } from "@prisma/client";
import { useContext } from "react";
import { api } from "~/utils/api";
import { AiOutlinePlusCircle, AiOutlineArrowDown } from "react-icons/ai";
import {
  ConversationContext,
  type ConversationContextType,
} from "~/context/conversationContext";

function ConversationContainer() {
  const { currentConversation, setCurrentPrompt, setPrompts, prompts } =
    useContext(ConversationContext) as ConversationContextType;

  const promptMutation = api.prompt.post.useMutation({
    onSuccess: (newPrompt: Prompt) => {
      setPrompts((prompts) => prompts.concat(newPrompt));
    },
    onError: (error) => {
      console.error("response", error);
    },
  });

  const createPrompt = () => {
    if (currentConversation) {
      const latestOrder: number = prompts.reduce(
        (acc: number, prompt: Prompt) => {
          return prompt.order > acc ? prompt.order : acc;
        },
        -1
      );
      const newPrompt = {
        name: "New Prompt",
        text: "",
        isContextPrompt: prompts.length === 0,
        conversationId: currentConversation?.id,
        matrixParametersX: "",
        matrixParametersY: "",
        order: latestOrder + 1,
      };
      promptMutation.mutate(newPrompt);
    }
  };

  return (
    <div className="flex flex-col justify-center align-middle">
      {/* HEADER */}
      <div className="border-l-1 w-full border border-r-0 border-t-0 border-b-0 border-white bg-gray-800 p-3 text-center text-white">
        <h3 className="text-xl">Conversation Viewer</h3>
      </div>
      {/* BODY */}
      <div className="m-5 flex flex-col ">
        {!currentConversation && (
          <>No conversation selected. Start a conversation first.</>
        )}
        {currentConversation && prompts.length === 0 && (
          <div>
            <h1>No prompts found.</h1>
          </div>
        )}
        {prompts.map((prompt) => (
          <div
            className="flex flex-col items-center
          "
            key={prompt.id}
          >
            <div
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                setCurrentPrompt(prompt);
              }}
              className="mb-2 w-full cursor-pointer rounded-md border border-black/20 bg-gray-100 p-4 text-center"
            >
              {prompt.name}
            </div>
            <AiOutlineArrowDown className="mb-2" />
          </div>
        ))}
        {currentConversation && (
          <button
            className="mx-auto flex flex-row items-center gap-2 rounded-md border-2 px-2 py-3"
            onClick={createPrompt}
          >
            Create Prompt <AiOutlinePlusCircle />
          </button>
        )}
      </div>
    </div>
  );
}

export default ConversationContainer;
