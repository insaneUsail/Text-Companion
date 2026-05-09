import { useEffect, useState } from "react";
import { getUserBooks } from "../services/bookService";
import BookCard from "./BookCard";

function BookList({ userId }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchBooks = async () => {
      const data = await getUserBooks(userId);
      setBooks(data);
    };

    fetchBooks();
  }, [userId]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">
        Your Books
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;