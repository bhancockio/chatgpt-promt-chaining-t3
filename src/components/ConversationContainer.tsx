import { type Prompt, type Conversation } from "@prisma/client";
import { type Dispatch, type SetStateAction, useState } from "react";
import { api } from "~/utils/api";

function ConversationContainer({
  currentConversation,
  setCurrentPrompt,
}: {
  currentConversation: Conversation | undefined;
  setCurrentPrompt: Dispatch<SetStateAction<Prompt | undefined>>;
}) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  api.prompt.getAllPromptsForConversation.useQuery(
    { conversationId: currentConversation?.id || "" },
    {
      enabled: currentConversation?.id !== undefined,
      onSuccess: (prompts) => {
        console.log("prompts", prompts);
        setPrompts(prompts);
        if (prompts.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          setCurrentPrompt(prompts[0]);
        }
      },
      onError: (error) => {
        console.error(error);
        setPrompts([]);
      },
    }
  );

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
        text: "test",
        isContextPrompt: prompts.length === 0,
        conversationId: currentConversation?.id,
      };
      promptMutation.mutate(newPrompt);
    }
  };

  return (
    <div className="flex flex-col justify-center align-middle">
      {/* HEADER */}
      <div className="border-r-1 border-l-1 w-full border border-t-0 border-b-0 border-white bg-gray-800 p-3 text-center text-white">
        <h3 className="text-xl">Conversation Viewer</h3>
      </div>
      {/* BODY */}
      <div className="m-5 flex flex-col">
        {prompts.length === 0 && (
          <div>
            <h1>No prompts found.</h1>
          </div>
        )}
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              setCurrentPrompt(prompt);
            }}
            className="mb-8 cursor-pointer rounded-md border border-black/20 bg-gray-100 p-4 text-center"
          >
            {prompt.text}
          </div>
        ))}
        <button onClick={createPrompt}>
          Create Prompt <span>+</span>
        </button>
      </div>
    </div>
  );
}

export default ConversationContainer;
