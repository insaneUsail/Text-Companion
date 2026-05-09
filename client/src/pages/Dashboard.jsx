import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Navbar from "../components/Navbar";
import PdfUpload from "../components/PdfUpload";
import BookList from "../components/BookList";



function Dashboard() {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
  <div className="min-h-screen bg-slate-950 text-white">
    
    <Navbar />

    <div className="p-8">
      <h1 className="text-4xl font-bold">
        TextCompanion
      </h1>

      <p className="mt-4 text-slate-300">
        Welcome, {currentUser?.displayName}
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 rounded-lg bg-red-500 px-5 py-2 font-semibold hover:bg-red-600"
      >
        Logout
      </button>
        {currentUser && (
  <>
    <PdfUpload userId={currentUser.uid} />
    <BookList userId={currentUser.uid} />
  </>
)}
    </div>

  </div>
);
}

export default Dashboard;