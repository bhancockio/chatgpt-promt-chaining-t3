import { type Prompt, type Conversation } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";

const PromptCard = ({ prompt }: { prompt: Prompt }) => {
  return <div>{prompt.text}</div>;
};

function ConversationContainer({
  currentConversation,
}: {
  currentConversation: Conversation | undefined;
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

  const promptMutation = api.prompt.post.useMutation({
    onSuccess: () => {
      console.log("Successfully created conversation");
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
    <div className="flex flex-col p-5">
      <div className="mb-6 flex flex-row justify-between">
        <p>
          Current Conversation:{" "}
          {currentConversation
            ? currentConversation.name
            : "No conversation currently selected"}
        </p>
        <button onClick={createPrompt}>Create Prompt</button>
      </div>
      {/* PROMPTS */}
      <div className="text-center">
        {prompts.length === 0 && (
          <div>
            <p>No prompts. </p>
            <p>Create a new prompt to get started.</p>
          </div>
        )}
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}

export default ConversationContainer;
