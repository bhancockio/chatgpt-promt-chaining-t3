import { type Prompt } from "@prisma/client";
import { type FormEvent } from "react";
import { object, string, type ZodError } from "zod";

const promptSchema = object({
  text: string({
    required_error: "Tweet text is required",
  }),
});

function PromptEditor({ prompt }: { prompt: Prompt | undefined }) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(e.target);

    // try {
    //   promptSchema.parse({});
    // } catch (e: unknown) {
    //   console.error(e);
    // }
  };

  return (
    <div className="flex flex-col p-5">
      <div className="flex flex-row justify-between">
        <p>Prompt Editor</p>
        <button type="submit">Save Prompt</button>
      </div>
      <div>{prompt?.id}</div>
      <form onSubmit={(e) => handleSubmit(e)}></form>
    </div>
  );
}

export default PromptEditor;
