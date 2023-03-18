/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ConversationResult } from "@prisma/client";
import { useContext, useState } from "react";
import {
  ConversationContext,
  type ConversationContextType,
} from "~/context/conversationContext";
import ConversationResultsPopup from "./ConversationResultsPopup";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineCheck, AiOutlineEye } from "react-icons/ai";
import { BsPencil, BsTrash } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import dayjs from "dayjs";
import { api } from "~/utils/api";

function ConversationResultList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [fetchingConversation, setFetchingConversation] = useState(false);
  const {
    currentConversation,
    conversationResults,
    setCurrentConversationResult,
    setConversationResults,
    currentConversationResult,
  } = useContext(ConversationContext) as ConversationContextType;

  const updateConversationResultMutation =
    api.conversationResult.update.useMutation({
      onSuccess: (conversationResult) => {
        setConversationResults((oldResults) =>
          oldResults.map((result) =>
            result.id === conversationResult.id ? conversationResult : result
          )
        );
      },
      onError: (error) => {
        console.error("Error updating conversation result");
        console.error(error);
      },
      onSettled: () => {
        setIsEdit(false);
      },
    });

  const runConversationHandler = () => {
    if (currentConversation) {
      setFetchingConversation(true);
      fetch(`api/conversation/${currentConversation.id}`)
        .then((resp) => resp.json())
        .then((conversationResult: ConversationResult) => {
          console.log("conversationResult", conversationResult);
          setConversationResults((oldResults) => [
            conversationResult,
            ...oldResults,
          ]);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setFetchingConversation(false);
        });
    }
  };

  const handleViewConversationResultClicked = (
    conversationResult: ConversationResult
  ) => {
    setCurrentConversationResult(conversationResult);
    setIsOpen(true);
  };

  const handleEditConversationResultClicked = (
    conversationResult: ConversationResult
  ) => {
    setCurrentConversationResult(conversationResult);
    setIsEdit(true);
  };

  const handleDeleteConversationResultClicked = (
    conversationResult: ConversationResult
  ) => {
    setCurrentConversationResult(conversationResult);
    setIsOpen(true);
  };

  const updateConversationResult = (conversationResult: ConversationResult) => {
    updateConversationResultMutation.mutate({
      id: conversationResult.id,
      name: newName,
    });
  };

  return (
    <>
      <div className="z-100 flex flex-col border-0 border-t-2">
        {/* HEADER */}
        <div className="mx-5 my-2 flex flex-row items-center justify-between">
          <p className="text-xl font-bold text-gray-800">
            Conversation Results
          </p>
          <button
            onClick={runConversationHandler}
            className={`rounded-md bg-[#74aa9c] px-3 py-2 text-white ${
              currentConversation || !fetchingConversation ? "" : "opacity-30"
            }`}
            disabled={!currentConversation || fetchingConversation}
          >
            {fetchingConversation ? (
              <div className="flex flex-row items-center gap-3">
                Executing <ClipLoader color="white" size={15} />
              </div>
            ) : (
              "Run Conversation"
            )}
          </button>
        </div>

        {/* LIST */}
        <table className="w-full table-auto">
          <tbody className="divide-y divide-gray-200">
            {conversationResults.map((result) => (
              <tr key={result.id} className=" odd:bg-gray-200 even:bg-gray-100">
                <td className="px-4 py-2">
                  {isEdit && currentConversationResult?.id == result.id ? (
                    <input
                      className="w-full rounded-md border-2 border-gray-400 bg-transparent px-1"
                      onChange={(e) => setNewName(e.target.value)}
                      defaultValue={result.name}
                    />
                  ) : (
                    result.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {dayjs(result.createdAt).format("YYYY-MM-DD hh:mm A")}
                </td>
                <td className="flex flex-row gap-3 px-4 py-2">
                  {isEdit && currentConversationResult?.id == result.id ? (
                    <>
                      <button
                        className="flex cursor-pointer flex-row"
                        onClick={() => updateConversationResult(result)}
                      >
                        <AiOutlineCheck className="my-auto text-lg" />
                      </button>
                      <span>|</span>
                      <button
                        className="flex cursor-pointer flex-row"
                        onClick={() => setIsEdit(false)}
                      >
                        <RxCross1 className="my-auto cursor-pointer" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex cursor-pointer flex-row"
                        onClick={() =>
                          handleViewConversationResultClicked(result)
                        }
                      >
                        <AiOutlineEye className="my-auto text-lg hover:text-blue-500" />
                      </button>
                      <span>|</span>
                      <button
                        className="flex cursor-pointer flex-row"
                        onClick={() =>
                          handleEditConversationResultClicked(result)
                        }
                      >
                        <BsPencil className="my-auto hover:text-green-500" />
                      </button>
                      <span>|</span>
                      <button
                        className="flex cursor-pointer flex-row"
                        onClick={() =>
                          handleDeleteConversationResultClicked(result)
                        }
                      >
                        <BsTrash className="my-auto hover:text-red-500" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConversationResultsPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default ConversationResultList;
