import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../services/firebase";
import { saveUserToFirestore } from "../services/userService";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async () => {
    try {
      let result;

      if (isSignup) {
        result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      await saveUserToFirestore({
        ...result.user,
        displayName: name || result.user.displayName || "Reader",
      });

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8">
        <h1 className="text-3xl font-bold">
          {isSignup ? "Create Account" : "Login"}
        </h1>

        {isSignup && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-6 w-full rounded-lg bg-slate-800 p-3 outline-none"
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mt-4 w-full rounded-lg bg-slate-800 p-3 outline-none"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="mt-4 w-full rounded-lg bg-slate-800 p-3 outline-none"
        />

        <button
          onClick={handleEmailAuth}
          className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full rounded-lg bg-slate-700 py-3 font-semibold hover:bg-slate-600"
        >
          Continue with Google
        </button>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="mt-5 text-sm text-blue-400"
        >
          {isSignup
            ? "Already have account? Login"
            : "New user? Create account"}
        </button>
      </div>
    </div>
  );
}

export default Login;