import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { explainText } from "../services/aiService";
import { saveVocabulary } from "../services/vocabularyService";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

function PdfViewer({ fileUrl, book, userId }) {
  const viewerRef = useRef(null);
  const scrollBoxRef = useRef(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);

  const [baseWidth, setBaseWidth] = useState(760);

  const [showAiPanel, setShowAiPanel] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiAnswer, setAiAnswer] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const updatePdfWidth = () => {
    if (!viewerRef.current) return;

    const availableWidth =
      viewerRef.current.clientWidth - 96;

    setBaseWidth(
      Math.min(
        Math.max(availableWidth, 420),
        760
      )
    );
  };

  useEffect(() => {
    updatePdfWidth();

    window.addEventListener("resize", updatePdfWidth);

    return () =>
      window.removeEventListener("resize", updatePdfWidth);
  }, [showAiPanel]);

  const preserveScroll = (callback) => {
    const box = scrollBoxRef.current;
    const previousTop = box?.scrollTop || 0;

    callback();

    setTimeout(() => {
      if (box) {
        box.scrollTop = previousTop;
      }
    }, 0);
  };

  const goPrev = () => {
    preserveScroll(() => {
      setPageNumber((prev) =>
        Math.max(prev - 1, 1)
      );
    });
  };

  const goNext = () => {
    preserveScroll(() => {
      setPageNumber((prev) =>
        numPages
          ? Math.min(prev + 1, numPages)
          : prev
      );
    });
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const closeAiPanel = () => {
    setShowAiPanel(false);
    setSelectedText("");
    setAiAnswer(null);
    setLoadingAi(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();

      if (e.ctrlKey && e.key === "+") {
        e.preventDefault();
        zoomIn();
      }

      if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }

      if (e.key === "Escape") {
        closeAiPanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [numPages]);

  const handleTextSelection = async () => {
  const selection = window.getSelection();

  if (!selection) return;

  const text = selection.toString().trim();

  if (!text) return;

    const context =
      selection.anchorNode?.textContent || "";

    setSelectedText(text);
    setAiAnswer(null);
    setShowAiPanel(true);

    try {
      setLoadingAi(true);

      const data = await explainText(text, context);

      try {
        const parsed =
          typeof data.answer === "string"
            ? JSON.parse(data.answer)
            : data.answer;

        setAiAnswer(parsed);
      } catch {
        setAiAnswer({
          meaning: data.answer,
          explanation: "",
          example: "",
          synonyms: [],
          importance: "",
        });
      }
    } catch (error) {
      console.log(error);

      setAiAnswer({
        meaning: "AI explanation failed.",
        explanation: "",
        example: "",
        synonyms: [],
        importance: "",
      });
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSaveVocabulary = async () => {
    if (!userId || !selectedText || !aiAnswer) {
      return alert("Nothing to save");
    }

    await saveVocabulary({
      userId,
      bookTitle: book?.title || "Unknown Book",
      selectedText,
      aiAnswer: JSON.stringify(aiAnswer),
    });

    alert("Saved to vocabulary");
  };

  return (
    <div
      className={
        showAiPanel
          ? "grid h-screen grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[1fr_480px]"
          : "grid h-screen grid-cols-1 overflow-hidden"
      }
    >
      <div className="m-4 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <div className="z-40 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="rounded-md bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            >
              ← Back
            </button>

            <div className="max-w-[250px] truncate text-sm font-semibold text-slate-300">
              {book?.title || "PDF Reader"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled={pageNumber <= 1}
              onClick={goPrev}
              className="rounded-md bg-slate-800 px-3 py-2 hover:bg-slate-700 disabled:opacity-40"
            >
              ←
            </button>

            <input
              type="number"
              value={pageNumber}
              min="1"
              max={numPages || 1}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (!value) return;

                preserveScroll(() => {
                  setPageNumber(
                    Math.min(
                      Math.max(value, 1),
                      numPages || 1
                    )
                  );
                });
              }}
              className="w-16 rounded-md bg-slate-800 px-2 py-2 text-center text-white outline-none"
            />

            <span className="text-sm text-slate-400">
              / {numPages || "-"}
            </span>

            <button
              disabled={pageNumber >= numPages}
              onClick={goNext}
              className="rounded-md bg-slate-800 px-3 py-2 hover:bg-slate-700 disabled:opacity-40"
            >
              →
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={zoomOut}
              className="rounded-md bg-slate-800 px-3 py-2 text-lg hover:bg-slate-700"
            >
              −
            </button>

            <button
              onClick={resetZoom}
              className="min-w-[75px] rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold hover:bg-slate-700"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={zoomIn}
              className="rounded-md bg-slate-800 px-3 py-2 text-lg hover:bg-slate-700"
            >
              +
            </button>

            <a
              href={fileUrl}
              target="_blank"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-700"
            >
              Open
            </a>
          </div>
        </div>

        <div
          ref={viewerRef}
          className="min-h-0 flex-1 bg-slate-800"
        >
          <div
            ref={scrollBoxRef}
            className="flex h-full justify-center overflow-auto px-6 py-2"
          >
            <div
              onMouseUp={handleTextSelection}
              onTouchEnd={() => {
                setTimeout(handleTextSelection, 500);
              }}
              className="h-fit rounded-xl bg-slate-700 p-0 shadow-2xl"
            >
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  width={baseWidth * zoom}
                />
              </Document>
            </div>
          </div>
        </div>

        <p className="border-t border-slate-800 bg-slate-900 px-4 py-3 text-center text-sm text-slate-400">
          Use ← / → for pages, Ctrl + / Ctrl - for zoom, Esc to close AI.
        </p>
      </div>

      {showAiPanel && (
        <div className="m-4 ml-0 h-fit rounded-2xl border border-slate-600 bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-green-400">
              AI Assistant
            </h3>

            <button
              onClick={closeAiPanel}
              className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300 hover:bg-slate-700"
            >
              ✕
            </button>
          </div>

          {selectedText && (
            <p className="mt-2 max-h-32 overflow-y-auto rounded-lg bg-slate-800 p-3 text-sm text-blue-300">
              {selectedText}
            </p>
          )}

          {loadingAi && (
            <p className="mt-6 text-slate-400">
              Thinking...
            </p>
          )}

          {aiAnswer && !loadingAi && (
            <div className="mt-3 space-y-2">
              <InfoBlock title="Meaning" content={aiAnswer.meaning} />
              <InfoBlock title="Explain" content={aiAnswer.explanation} />
              <InfoBlock title="Example" content={aiAnswer.example} />
              <InfoBlock
                title="Synonyms"
                content={
                  Array.isArray(aiAnswer.synonyms)
                    ? aiAnswer.synonyms.join(", ")
                    : aiAnswer.synonyms
                }
              />
              <InfoBlock title="Why" content={aiAnswer.importance} />

              <button
                onClick={handleSaveVocabulary}
                className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
              >
                Save to Vocabulary
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoBlock({ title, content }) {
  if (!content) return null;

  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-400">
        {title}
      </h4>

      <p className="leading-7 text-slate-300">
        {content}
      </p>
    </div>
  );
}

export default PdfViewer;