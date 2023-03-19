import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

function Login() {
  const { data: sessionData } = useSession();

  const handleAuthClicked = () => {
    if (sessionData) {
      void signOut();
    } else {
      void signIn("discord", { callbackUrl: "/" });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center align-middle">
      <Image
        src={"/prompt-chaining-logo.png"}
        width="200"
        height="200"
        alt="prompt-chaining-logo"
      />
      <h1 className="mb-2 mt-8 text-3xl font-bold ">
        Welcome to ChatGPT Prompt Chaining
      </h1>
      <p className="mb-2 ">Login with your Discord account to continue</p>
      <div className="flex flex-row gap-2">
        <button
          onClick={handleAuthClicked}
          className="rounded-md bg-[#74aa9c] px-4 py-3 text-lg text-white hover:bg-[#74aa9c]/80"
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  );
}

export default Login;
