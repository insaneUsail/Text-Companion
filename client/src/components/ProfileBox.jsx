import { deleteUser, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

function ProfileBox({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDelete = async () => {
    const ok = confirm("Delete your account?");
    if (!ok) return;

    await deleteUser(auth.currentUser);
    navigate("/");
  };

  return (
    <div className="rounded-xl bg-slate-900 p-5">
      <h3 className="font-bold text-green-400">Profile</h3>

      <p className="mt-2 text-sm text-slate-300">
        {user?.displayName || "Reader"}
      </p>

      <p className="text-sm text-slate-400">
        {user?.email}
      </p>

      <button
        onClick={handleLogout}
        className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm"
      >
        Logout
      </button>

      <button
        onClick={handleDelete}
        className="ml-3 rounded-lg bg-slate-700 px-4 py-2 text-sm"
      >
        Delete
      </button>
    </div>
  );
}

export default ProfileBox;