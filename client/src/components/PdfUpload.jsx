import { useState } from "react";

import { uploadPdf }
from "../services/uploadService";

import { saveBookToFirestore }
from "../services/bookService";

function PdfUpload({ userId }) {

  const [file, setFile] = useState(null);

  const [uploading, setUploading] =
    useState(false);

  const handleUpload = async () => {

    if (!file) {
      return alert("Select PDF first");
    }

    try {

      setUploading(true);

      const data = await uploadPdf(file);

      await saveBookToFirestore({
        userId,
        title: file.name,
        fileUrl: data.fileUrl,
      });

      console.log(data);

      alert("PDF uploaded successfully");

      setFile(null);

    } catch (error) {

      console.log(error);

      alert("Upload failed");

    } finally {

      setUploading(false);

    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8">

      <h2 className="text-2xl font-bold">
        Upload PDF
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
        className="mt-5 w-full rounded-lg bg-slate-800 p-3 text-slate-300"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading
          ? "Uploading..."
          : "Upload PDF"}
      </button>

    </div>
  );
}

export default PdfUpload;