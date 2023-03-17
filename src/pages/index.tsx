import { type NextPage } from "next";
import ConversationContainer from "~/components/ConversationContainer";
import ConversationResults from "~/components/ConversationResultList";
import ConversationSidebar from "~/components/ConversationSidebar";
import PromptEditor from "~/components/PromptEditor";
import ConversationProvider from "~/context/conversationContext";

const Home: NextPage = () => {
  return (
    <ConversationProvider>
      <div className="flex flex-row">
        <div className="w-1/6 min-w-[200px]">
          <ConversationSidebar />
        </div>
        <div className="h-screen w-5/6">
          <div className="flex h-3/4 flex-row">
            <div className="w-2/3">
              <ConversationContainer />
            </div>
            <div className="border-gray-80 w-1/3 border-0 border-l-2 text-black">
              <PromptEditor />
            </div>
          </div>
          <div className="h-1/4">
            <ConversationResults />
          </div>
        </div>
      </div>
    </ConversationProvider>
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
