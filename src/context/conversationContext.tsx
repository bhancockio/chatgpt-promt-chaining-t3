/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Conversation, ConversationResult, Prompt } from "@prisma/client";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
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
  conversationResults: ConversationResult[];
  setConversationResults: Dispatch<SetStateAction<ConversationResult[]>>;
  currentConversationResult: ConversationResult | null;
  setCurrentConversationResult: Dispatch<
    SetStateAction<ConversationResult | null>
  >;
};

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationResults, setConversationResults] = useState<
    ConversationResult[]
  >([]);
  const [currentConversationResult, setCurrentConversationResult] =
    useState<ConversationResult | null>(null);

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
        setPrompts(prompts);
        if (prompts.length > 0) {
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

  api.conversationResult.getAllResultsForConversation.useQuery(
    {
      conversationId: currentConversation?.id || "",
    },
    {
      enabled: currentConversation?.id !== undefined,
      onSuccess: (fetchedConversationResults: ConversationResult[]) => {
        setConversationResults(fetchedConversationResults);
      },
      onError: (error) => {
        console.error(error);
        setConversationResults([]);
      },
    }
  );

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
        conversationResults,
        setConversationResults,
        currentConversationResult,
        setCurrentConversationResult,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
