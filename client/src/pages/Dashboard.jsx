import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PdfUpload from "../components/PdfUpload";
import BookList from "../components/BookList";
import ProfileBox from "../components/ProfileBox";
import PdfUrlImport from "../components/PdfUrlImport";

function Dashboard() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="p-8">
        <h1 className="text-4xl font-bold">
          TextCompanion
        </h1>

        <p className="mt-4 text-slate-300">
          Welcome, {currentUser?.displayName || "Reader"}
        </p>

        {currentUser && (
          <>
            <ProfileBox user={currentUser} />

            <PdfUpload userId={currentUser.uid} />

            <PdfUrlImport userId={currentUser.uid} />

            <BookList userId={currentUser.uid} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;