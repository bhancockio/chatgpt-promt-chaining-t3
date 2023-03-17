import { useContext } from "react";
import {
  ConversationContext,
  type ConversationContextType,
} from "~/context/conversationContext";

function ConversationResultList() {
  const { currentConversation } = useContext(
    ConversationContext
  ) as ConversationContextType;
  const dummyData = [
    { id: 1, date: "2023-03-13", name: "Test 1" },
    { id: 2, date: "2023-03-14", name: "Test 2" },
    { id: 3, date: "2023-03-14", name: "Test 3" },
    { id: 4, date: "2023-03-15", name: "Test 4" },
  ];

  const runConversationHandler = () => {
    if (currentConversation) {
      fetch(`api/conversation/${currentConversation.id}`)
        .then((resp) => resp.json())
        .then((data) => console.log("data", data))
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="flex flex-col border-0 border-t-2">
      {/* HEADER */}
      <div className="mx-5 my-2 flex flex-row items-center justify-between">
        <p className="text-xl font-bold text-gray-800">Conversation Results</p>
        <button
          onClick={runConversationHandler}
          className={`rounded-md bg-[#74aa9c] px-3 py-2 text-white ${
            currentConversation ? "" : "opacity-30"
          }`}
          disabled={!currentConversation}
        >
          Run Conversation
        </button>
      </div>

      {/* LIST */}
      <table className="w-full table-auto">
        <tbody className="divide-y divide-gray-200">
          {dummyData.map((data) => (
            <tr key={data.id} className="odd:bg-gray-200 even:bg-gray-100">
              <td className="px-4 py-2">{data.date}</td>
              <td className="px-4 py-2">{data.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConversationResultList;
