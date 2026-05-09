import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  auth,
  googleProvider,
} from "../services/firebase";

import { saveUserToFirestore }
from "../services/userService";

function Login() {

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      await saveUserToFirestore(
        result.user
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">

        <h1 className="text-4xl font-bold">
          TextCompanion
        </h1>

        <p className="mt-3 text-slate-400">
          AI-powered smart reading companion.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
        >
          Continue with Google
        </button>

      </div>

    </div>
  );
}

export default Login;