import { signIn, signOut, useSession } from "next-auth/react";

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
      <h1>Welcome to ChatGPT Prompt Chaining</h1>
      <p>Login with your GitHub account to continue</p>
      <div className="flex flex-row gap-2">
        <button
          onClick={handleAuthClicked}
          className="rounded-md bg-[#74aa9c] px-4 py-3 text-xl text-white hover:bg-[#74aa9c]/80"
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  );
}

export default Login;
