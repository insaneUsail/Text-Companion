import { Link } from "react-router-dom";

const books = [
  { title: "Atomic Habits", category: "Self Growth" },
  { title: "Brief History of Time", category: "Science" },
  { title: "Rich Dad Poor Dad", category: "Finance" },
  { title: "Deep Work", category: "Productivity" },
];

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-400">
            TextCompanion
          </h1>

          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700"
          >
            Login
          </Link>
        </nav>

        <section className="mt-20 text-center">
          <h2 className="text-5xl font-bold">
            Read PDFs with AI explanations
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Upload books, select confusing words or sentences, and get simple
            explanations, examples, synonyms, and meaning in context.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-block rounded-xl bg-green-600 px-7 py-3 font-bold hover:bg-green-700"
          >
            Start Reading
          </Link>
        </section>

        <section className="mt-20">
          <h3 className="text-2xl font-bold">Book Suggestions</h3>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {books.map((book) => (
              <div
                key={book.title}
                className="rounded-xl bg-slate-900 p-5"
              >
                <p className="text-sm text-blue-400">
                  {book.category}
                </p>

                <h4 className="mt-2 font-bold">
                  {book.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;