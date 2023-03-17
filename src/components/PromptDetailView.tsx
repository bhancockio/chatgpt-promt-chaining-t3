import { type Prompt } from "@prisma/client";

function PromptDetailView({
  currentPrompt,
}: {
  currentPrompt: Prompt | undefined;
}) {
  return <div>{currentPrompt?.text}</div>;
}

export default PromptDetailView;
