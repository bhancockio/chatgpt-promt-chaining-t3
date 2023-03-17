import { type Conversation, type Prompt } from "@prisma/client";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import ConversationContainer from "~/components/ConversationContainer";
import ConversationResults from "~/components/ConversationResultList";
import ConversationSidebar from "~/components/ConversationSidebar";
import PromptEditor from "~/components/PromptEditor";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>();
  const [currentConversation, setCurrentConversation] =
    useState<Conversation>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationResultList, setConversationResultList] = useState([]);

  api.conversation.getall.useQuery(undefined, {
    onSuccess: (resp) => {
      setConversations(resp);
      if (resp.length > 0) {
        setCurrentConversation(resp[0]);
      }
    },
    onError: (error) => {
      setConversations([]);
      console.error(error);
    },
  });

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

  useEffect(() => {
    console.log("current prompt", currentPrompt);
  }, [currentPrompt]);

  return (
    <div className="flex flex-row">
      <div className="w-1/6">
        <ConversationSidebar
          conversations={conversations}
          setCurrentConversation={setCurrentConversation}
          setConversations={setConversations}
        />
      </div>
      <div className="h-screen w-5/6">
        <div className="flex h-3/4 flex-row">
          <div className="w-2/3">
            <ConversationContainer
              setCurrentPrompt={setCurrentPrompt}
              currentConversation={currentConversation}
              setPrompts={setPrompts}
              prompts={prompts}
            />
          </div>
          <div className="border-gray-80 w-1/3 border-0 border-l-2 text-black">
            <PromptEditor prompt={currentPrompt} setPrompts={setPrompts} />
          </div>
        </div>
        <div className="h-1/4">
          <ConversationResults />
        </div>
      </div>
    </div>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
