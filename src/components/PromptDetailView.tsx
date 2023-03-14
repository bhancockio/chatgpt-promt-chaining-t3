import { type Prompt } from "@prisma/client";
import React from "react";

function PromptDetailView({
  currentPrompt,
}: {
  currentPrompt: Prompt | undefined;
}) {
  return <div>{currentPrompt?.text}</div>;
}

export default PromptDetailView;
