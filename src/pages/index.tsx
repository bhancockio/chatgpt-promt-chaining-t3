import type { NextPage } from "next";
import ConversationContainer from "~/components/ConversationContainer";
import ConversationResults from "~/components/ConversationResultList";
import ConversationSidebar from "~/components/ConversationSidebar";
import PromptEditor from "~/components/PromptEditor";
import ConversationProvider from "~/context/conversationContext";

const Home: NextPage = () => {
  return (
    <ConversationProvider>
      <div className="flex flex-row">
        <div className="w-1/6 min-w-[200px] overflow-y-auto">
          <ConversationSidebar />
        </div>
        <div className="h-screen w-5/6">
          <div className="flex h-3/4 flex-row overflow-y-auto">
            <div className="w-2/3">
              <ConversationContainer />
            </div>
            <div className="border-gray-80 w-1/3 overflow-y-auto border-0 border-l-2 text-black">
              <PromptEditor />
            </div>
          </div>
          <div className="h-1/4 overflow-y-auto">
            <ConversationResults />
          </div>
        </div>
      </div>
    </ConversationProvider>
  );
};

export default Home;
