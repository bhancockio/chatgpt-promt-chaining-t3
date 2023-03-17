import type { Conversation, Prompt } from "@prisma/client";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { api } from "~/utils/api";

export type ConversationContextType = {
  prompts: Prompt[];
  setPrompts: Dispatch<SetStateAction<Prompt[]>>;
  currentPrompt: Prompt | null;
  setCurrentPrompt: Dispatch<SetStateAction<Prompt | null>>;
  conversations: Conversation[];
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  currentConversation: Conversation | null;
  setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>;
};

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  //   const [conversationResultList, setConversationResultList] = useState([]);

  api.conversation.getall.useQuery(undefined, {
    onSuccess: (conversations: Conversation[]) => {
      setConversations(conversations);
      if (conversations.length > 0) {
        const firstConversation: Conversation | null = conversations[0] || null;
        setCurrentConversation(firstConversation);
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
          const prompt: Prompt | null = prompts[0] || null;
          setCurrentPrompt(prompt);
        }
      },
      onError: (error) => {
        console.error(error);
        setPrompts([]);
      },
    }
  );

  useEffect(() => {
    console.log("Current conversation", currentConversation);
  }, [currentConversation]);

  useEffect(() => {
    console.log("current prompt", currentPrompt);
  }, [currentPrompt]);

  return (
    <ConversationContext.Provider
      value={{
        prompts,
        setPrompts,
        currentPrompt,
        setCurrentPrompt,
        currentConversation,
        setCurrentConversation,
        conversations,
        setConversations,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
