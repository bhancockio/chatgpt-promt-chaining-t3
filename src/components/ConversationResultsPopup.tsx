/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  ConversationContext,
  type ConversationContextType,
} from "~/context/conversationContext";

const CONVERSATION_SEPARATOR = "------------";

function ConversationResultsPopup({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formattedConversationResult, setFormattedConversationResult] =
    useState("");
  const { currentConversationResult } = useContext(
    ConversationContext
  ) as ConversationContextType;

  useEffect(() => {
    if (currentConversationResult) {
      const formatted = currentConversationResult.result
        .replace(/\\"/g, "")
        .replaceAll('"', "");
      setFormattedConversationResult(formatted);
    }
  }, [currentConversationResult]);

  useEffect(() => {
    let initialRenderflag = false;
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef) {
        if (!modalRef.current?.contains(event.target as Node)) {
          console.log("trigger");
          if (initialRenderflag) {
            setIsOpen(false);
          } else {
            initialRenderflag = true;
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, setIsOpen, modalRef]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-80">
      <div
        ref={modalRef}
        className="relative z-50 mx-auto my-4 max-w-5xl rounded-lg bg-white p-8 shadow-lg"
      >
        <button
          className="absolute top-0 right-0 m-1 rounded-full p-2 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="x h-6 w-6">
            <path
              fillRule="evenodd"
              d="M14.348 5.652a.5.5 0 0 0-.707 0L10 9.293 6.357 5.652a.5.5 0 0 0-.707.707L9.293 10l-3.643 3.643a.5.5 0 0 0 .708.707L10 10.707l3.643 3.643a.5.5 0 0 0 .707-.707L10.707 10l3.641-3.648a.5.5 0 0 0 0-.707z"
            />
          </svg>
        </button>
        <div className="flex flex-col">
          {formattedConversationResult
            .split(CONVERSATION_SEPARATOR)
            .filter((conversation) => conversation.length !== 0)
            .map((conversation, idx) => (
              <div key={idx} className="mb-4 rounded-md bg-gray-100 p-4">
                {conversation
                  .split("\n")
                  .filter((str) => str !== "")
                  .map((str, idx) => (
                    <p className="mb-3 text-xl" key={idx}>
                      {str}
                    </p>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ConversationResultsPopup;
