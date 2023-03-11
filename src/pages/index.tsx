import { type NextPage } from "next";
import ConversationContainer from "~/components/ConversationContainer";
import PromptDetailView from "~/components/PromptDetailView";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const createPrompt = api.prompt.create.useMutation({
    onSuccess: () => {
      console.log("Successfully posted prompt");
    },
  });

  return (
    <div className="p-10">
      <div className="flex flex-row">
        <div className="flex w-full">
          <ConversationContainer />
        </div>
        <div className="flex w-full">
          <PromptDetailView />
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
