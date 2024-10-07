import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://library-system-backend-4rre.onrender.com/api/books",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  async function borrowBook(id) {
    try {
      const response = await axios.post(
        `https://library-system-backend-4rre.onrender.com/api/books/borrow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBooks(); // Refetch books to update the availability
      toast.success(response.data.message);
    } catch (error) {
      toast.success(error.response.data.message);
    }
  }

  if (loading) {
    return <h2 className="text-center text-xl">Loading...</h2>;
  }

  return (
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
              className="w-full h-72 object-cover" // Set height to 72 for uniformity
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-black bg-opacity-50">
              <h3 className="text-lg font-semibold text-white">{book.title}</h3>
              <p className="text-gray-300">Author: {book.author}</p>
              <div className="flex items-center mt-2">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {book.genre}
                </span>
                <span
                  className={`ml-2 text-xs ${
                    book.availability ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {book.availability ? "Available" : "Borrowed"}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-white text-sm text-gray-3000 ">
                  {new Date(book.createdAt).toLocaleDateString() ===
                    new Date().toLocaleDateString() && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      New Book
                    </span>
                  )}
                </span>
              </div>
              <button
                className={`mt-auto bg-blue-500 text-white font-semibold py-2 rounded ${
                  book.availability ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!book.availability}
                onClick={() => borrowBook(book._id)}
              >
                {book.availability ? "Borrow" : "Borrowed"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
