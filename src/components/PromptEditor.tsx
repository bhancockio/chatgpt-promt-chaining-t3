/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Prompt } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { object, string, type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import { api } from "~/utils/api";

const promptSchema = object({
  name: string({
    required_error: "Name is required",
  }),
  text: string({
    required_error: "Text is required",
  }),
});

type PromptSchema = z.infer<typeof promptSchema>;

function PromptEditor({
  prompt,
  setPrompts,
}: {
  prompt: Prompt | undefined;
  setPrompts: Dispatch<SetStateAction<Prompt[]>>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromptSchema>({
    resolver: zodResolver(promptSchema),
  });

  const promptMutation = api.prompt.post.useMutation({
    onSuccess: (newPrompt: Prompt) => {
      console.log("Successfully updated", newPrompt);
      setPrompts((oldPrompts) =>
        oldPrompts.map((oldPrompt) =>
          oldPrompt.id === newPrompt.id ? newPrompt : oldPrompt
        )
      );
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const onSubmit: SubmitHandler<PromptSchema> = (formData) => {
    if (prompt) {
      const data = {
        conversationId: prompt.conversationId,
        id: prompt.id,
        ...formData,
      };
      console.log("data", data);
      promptMutation.mutate(data);
    }
  };

  useEffect(() => {
    reset(prompt);
  }, [prompt, reset]);

  return (
    <div className="flex flex-col ">
      <div className="w-full bg-gray-800 p-3 text-center text-white">
        <h3 className="text-xl">Prompt</h3>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="m-5 flex flex-col align-middle"
      >
        <div className="relative mb-6">
          <input
            type="text"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            id="name"
            {...register("name")}
          />
          <label
            htmlFor="name"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Name
          </label>
          {errors.name && (
            <span style={{ color: "red" }}>{errors.name.message}</span>
          )}
        </div>
        <div className="relative mb-6">
          <textarea
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            id="text"
            rows={10}
            {...register("text")}
          />
          <label
            htmlFor="text"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Prompt Text
          </label>
          {errors.text && (
            <span style={{ color: "red" }}>{errors.text.message}</span>
          )}
        </div>
        <button
          className="cursor-pointer rounded-md border-2 border-gray-800 px-5 py-3 hover:bg-gray-800 hover:text-white"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default PromptEditor;
