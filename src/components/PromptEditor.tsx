/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Prompt } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { object, string, type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

const promptSchema = object({
  text: string({
    required_error: "Tweet text is required",
  }).min(10, { message: "Min 10" }),
});

type PromptSchema = z.infer<typeof promptSchema>;

function PromptEditor({ prompt }: { prompt: Prompt | undefined }) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptSchema>({
    resolver: zodResolver(promptSchema),
  });

  const onSubmit: SubmitHandler<PromptSchema> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col ">
      <div className="w-full bg-gray-800 p-3 text-center text-white">
        <h3 className="text-xl">Prompt</h3>
      </div>
      <div className="m-5">
        <div>{prompt?.id}</div>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-6">
            <textarea
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              id="text"
              rows={3}
              placeholder=""
              {...register("text")}
            />
            <label
              htmlFor="text"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Message
            </label>
            {errors.text && (
              <span style={{ color: "red" }}>{errors.text.message}</span>
            )}
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default PromptEditor;
