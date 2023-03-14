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
  });

  const createPrompt = () => {
    if (currentConversation) {
      const newPrompt = {
        text: "test",
        isContextPrompt: prompts.length === 0,
        conversationId: currentConversation?.id,
      };
      promptMutation.mutate(newPrompt, {
        onSuccess: (promptResponse) => {
          console.log("response", promptResponse);
          setPrompts((p) => p.concat(promptResponse));
        },
        onError: (error) => {
          console.log("response", error);
        },
      });
    }
  };

  return (
    <div className="flex flex-col justify-center align-middle">
      {/* HEADER */}
      <div className="w-full bg-gray-800 p-3 text-center text-white">
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
            className="cursor-pointer rounded-md border border-black/20 bg-gray-100 p-4 text-center"
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
