/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Prompt } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { object, string, type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useContext } from "react";
import { api } from "~/utils/api";
import {
  ConversationContext,
  type ConversationContextType,
} from "~/context/conversationContext";

const promptSchema = object({
  name: string({
    required_error: "Name is required",
  }),
  text: string({
    required_error: "Text is required",
  }),
  matrixParametersX: string().optional(),
  matrixParametersY: string().optional(),
  isContextPrompt: string(),
});

type PromptSchema = z.infer<typeof promptSchema>;

function PromptEditor() {
  const { setPrompts, setCurrentPrompt, currentPrompt } = useContext(
    ConversationContext
  ) as ConversationContextType;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromptSchema>({
    resolver: zodResolver(promptSchema),
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [isContextPrompt, setIsContextPrompt] = useState<boolean>(
    !!currentPrompt?.isContextPrompt
  );

  const postPromptMutation = api.prompt.post.useMutation({
    onSuccess: (newPrompt: Prompt) => {
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

  const deletePromptMutation = api.prompt.delete.useMutation({
    onSuccess: (deletedPrompt: Prompt) => {
      setPrompts((prompts) =>
        prompts.filter((p) => p.id !== deletedPrompt?.id)
      );
      setCurrentPrompt(null);
    },
    onError: (error) => {
      console.error("Error deleting prompt");
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<PromptSchema> = (formData) => {
    if (currentPrompt) {
      const data = {
        conversationId: currentPrompt.conversationId,
        id: currentPrompt.id,
        order: currentPrompt.order,
        name: formData.name,
        matrixParametersX: formData.matrixParametersX,
        matrixParametersY: formData.matrixParametersY,
        text: formData.text,
        isContextPrompt: isContextPrompt,
      };

      postPromptMutation.mutate(data);
    }
  };

  const deletePrompt = () => {
    if (currentPrompt) {
      deletePromptMutation.mutate({ id: currentPrompt.id });
    }
  };

  useEffect(() => {
    if (currentPrompt) {
      setIsContextPrompt(currentPrompt.isContextPrompt);
      reset({
        name: currentPrompt.name,
        text: currentPrompt.text,
        matrixParametersX: currentPrompt.matrixParametersX,
        matrixParametersY: currentPrompt.matrixParametersY,
        isContextPrompt: currentPrompt.isContextPrompt ? "true" : "false",
      } as PromptSchema);
    }
  }, [currentPrompt, reset]);

  return (
    <div className="flex flex-col text-black">
      <div className="w-full bg-gray-800 p-3 text-center ">
        <h3 className="text-xl text-white">Prompt Editor</h3>
      </div>

      {currentPrompt ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-5 flex flex-col align-middle text-black"
        >
          <div className="relative mb-6">
            <input
              type="text"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
              id="name"
              {...register("name")}
            />
            <label
              htmlFor="name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600  "
            >
              Name
            </label>
            {errors.name && (
              <span style={{ color: "red" }}>{errors.name.message}</span>
            )}
          </div>
          <div className="relative mb-6">
            <textarea
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
              id="text"
              rows={5}
              {...register("text", { required: false })}
            />
            <label
              htmlFor="text"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600  "
            >
              Prompt Text
            </label>

            {errors.text && (
              <span style={{ color: "red" }}>{errors.text.message}</span>
            )}
          </div>
          {!isContextPrompt && (
            <>
              <div className="relative mb-6">
                <input
                  type="text"
                  className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                  id="name"
                  {...register("matrixParametersX", { required: false })}
                />
                <label
                  htmlFor="matrixParametersX"
                  className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600  "
                >
                  X Parameters
                </label>
                <span className="text-xs text-gray-400">
                  Create comma separated list of formats (actionable, listicle,
                  etc.)
                </span>
                {errors.name && (
                  <span style={{ color: "red" }}>
                    {errors.matrixParametersX?.message}
                  </span>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  type="text"
                  className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                  id="matrixParametersY"
                  {...register("matrixParametersY", { required: false })}
                />
                <label
                  htmlFor="matrixParametersY"
                  className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600  "
                >
                  Y Parameters
                </label>
                {errors.name && (
                  <span style={{ color: "red" }}>
                    {errors.matrixParametersY?.message}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  Create comma separated list of topics (business, habits, etc.)
                </span>
              </div>
            </>
          )}
          <div className="mb-6 flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="isContextPrompt"
                type="checkbox"
                checked={isContextPrompt}
                onChange={() => setIsContextPrompt((current) => !current)}
                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300  dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
              />
            </div>
            <label
              htmlFor="isContextPrompt"
              className="ml-2 text-sm  text-gray-900 dark:text-gray-300"
            >
              Context Prompt
            </label>
          </div>
          <button
            className="mb-3 cursor-pointer rounded-md border-2 border-gray-800 px-5 py-3 hover:bg-gray-800 hover:text-white"
            type="submit"
          >
            Save
          </button>
          <button
            onClick={deletePrompt}
            className="cursor-pointer rounded-md border-2 border-red-500 px-5 py-3 hover:bg-red-500 hover:text-white"
          >
            Delete
          </button>
        </form>
      ) : (
        <div>No Prompt Selected.</div>
      )}
    </div>
  );
}

export default PromptEditor;
