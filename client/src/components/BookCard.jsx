import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <div className="rounded-xl bg-slate-900 p-5">

      <h3 className="font-bold">
        {book.title}
      </h3>

      <Link
        to="/reader"
        state={{ book }}
        className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700"
      >
        Read Book
      </Link>

    </div>
  );
}

export default BookCard;