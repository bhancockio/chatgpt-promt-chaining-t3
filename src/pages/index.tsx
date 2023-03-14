import { type Conversation, type Prompt } from "@prisma/client";
import { type NextPage } from "next";
import { useState } from "react";
import ConversationContainer from "~/components/ConversationContainer";
import ConversationSidebar from "~/components/ConversationSidebar";
import PromptEditor from "~/components/PromptEditor";
import PromptDetailView from "~/components/PromptEditor";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [currentPrompt, setCurrentPromt] = useState<Prompt>();
  const [currentConversation, setCurrentConversation] =
    useState<Conversation>();
  const [conversations, setConversations] = useState<Conversation[]>([]);

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

  return (
    <div className="flex flex-row">
      <div className="w-1/6">
        <ConversationSidebar
          conversations={conversations}
          setCurrentConversation={setCurrentConversation}
          setConversations={setConversations}
        />
      </div>
      <div className="w-3/6">
        <ConversationContainer
          setCurrentPrompt={setCurrentPromt}
          currentConversation={currentConversation}
        />
      </div>
      <div className="w-2/6 bg-gray-100 text-black">
        <PromptEditor prompt={currentPrompt} />
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
