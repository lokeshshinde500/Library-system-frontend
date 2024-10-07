import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://library-system-backend-4rre.onrender.com/api/books/borrowed/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  async function returnBook(id) {
    try {
      const response = await axios.post(
        `https://library-system-backend-4rre.onrender.com/api/books/return/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistically update local state
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error returning book";
      toast.error(errorMessage);
    }
  }

  if (loading) {
    return <h2 className="text-center text-xl">Loading...</h2>;
  }

  if (!books.length) {
    return (
      <h2 className="text-center text-xl text-red-600">
        No books are borrowed!
      </h2>
    );
  }

  return (
    <section>
      <div className="section-title">
        <h2 className="text-blue-600 text-4xl font-bold text-center my-10">
          MY BORROWED BOOKS
        </h2>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={book.bookImage}
                alt={book.title}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-between p-4 bg-black bg-opacity-50 hover:bg-opacity-20 transition">
                <h3 className="text-lg font-semibold text-white">{book.title}</h3>
                <p className="text-gray-300">Author: {book.author}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {book.genre}
                  </span>
                </div>

                <button
                  className={`bg-blue-500 text-white font-semibold py-2 rounded`}
                  onClick={() => returnBook(book._id)}
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BorrowedBooks;
