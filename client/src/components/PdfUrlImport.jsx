import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveBookToFirestore } from "../services/bookService";

function PdfUrlImport({ userId }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const savePdfLink = async () => {
    if (!title || !pdfUrl) {
      return alert("Enter title and PDF URL");
    }

    const book = {
      title,
      fileUrl: pdfUrl,
    };

    await saveBookToFirestore({
      userId,
      title,
      fileUrl: pdfUrl,
    });

    navigate("/reader", {
      state: { book },
    });
  };

  const searchGoogle = () => {
    window.open(
      "https://www.google.com/search?q=free+pdf+books",
      "_blank"
    );
  };

  return (
    <div className="mt-8 rounded-xl bg-slate-900 p-5">
      <h2 className="text-2xl font-bold">Add PDF Link</h2>

      <p className="mt-2 text-sm text-slate-400">
        Google cannot be opened inside iframe because it blocks embedding.
        Use search, copy PDF link, then paste here.
      </p>

      <button
        onClick={searchGoogle}
        className="mt-4 rounded-lg bg-green-600 px-4 py-2"
      >
        Search Books on Google
      </button>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book title"
        className="mt-4 w-full rounded-lg bg-slate-800 p-3 outline-none"
      />

      <input
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        placeholder="Paste PDF URL"
        className="mt-4 w-full rounded-lg bg-slate-800 p-3 outline-none"
      />

      <button
        onClick={savePdfLink}
        className="mt-4 rounded-lg bg-blue-600 px-5 py-2"
      >
        Save & Read
      </button>
    </div>
  );
}

export default PdfUrlImport;