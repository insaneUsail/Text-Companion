import { useLocation, Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import PdfViewer from "../components/PdfViewer";

function Reader() {

  const location = useLocation();

  const { currentUser } =
    useContext(AuthContext);

  const book =
    location.state?.book;

  if (!book) {

    return (

      <div className="min-h-screen bg-slate-950 p-8 text-white">

        <p>No book selected.</p>

        <Link
          to="/dashboard"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2"
        >
          Back
        </Link>

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <PdfViewer
        fileUrl={book.fileUrl}
        book={book}
        userId={currentUser?.uid}
      />

    </div>

  );
}

export default Reader;