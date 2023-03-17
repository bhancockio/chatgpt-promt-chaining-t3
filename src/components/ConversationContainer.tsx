import { type Prompt, type Conversation } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import { AiOutlinePlusCircle } from "react-icons/ai";

function ConversationContainer({
  currentConversation,
  setCurrentPrompt,
  setPrompts,
  prompts,
}: {
  currentConversation: Conversation | undefined;
  setCurrentPrompt: Dispatch<SetStateAction<Prompt | undefined>>;
  setPrompts: Dispatch<SetStateAction<Prompt[]>>;
  prompts: Prompt[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const promptMutation = api.prompt.post.useMutation({
    onSuccess: (newPrompt: Prompt) => {
      console.log("Successfully created conversation", newPrompt);
      setPrompts((prompts) => prompts.concat(newPrompt));
    },
    onError: (error) => {
      console.log("response", error);
    },
  });

  const createPrompt = () => {
    if (currentConversation) {
      const newPrompt = {
        name: "New Prompt",
        text: "",
        isContextPrompt: prompts.length === 0,
        conversationId: currentConversation?.id,
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
        {prompts.length === 0 && (
          <div>
            <h1>No prompts found.</h1>
          </div>
        )}
        {prompts.map((prompt) => (
          <div key={prompt.id}>
            <div
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                setCurrentPrompt(prompt);
              }}
              className="mb-8 cursor-pointer rounded-md border border-black/20 bg-gray-100 p-4 text-center"
            >
              {prompt.name}
            </div>
            {/* TODO: Place a down arrow here */}
          </div>
        ))}
        <button
          className="mx-auto flex flex-row items-center gap-2 rounded-md border-2 px-2 py-3"
          onClick={createPrompt}
        >
          Create Prompt <AiOutlinePlusCircle />
        </button>
      </div>
    </div>
  );
}

export default ConversationContainer;
