import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [token] = useState(localStorage.getItem("token"));

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://library-system-backend-4rre.onrender.com/api/books/myBooks/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(response.data.data);
    } catch (error) {
      toast.error("Error fetching books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const deleteBook = async (id) => {
    try {
      const response = await axios.delete(
        `https://library-system-backend-4rre.onrender.com/api/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting book";
      toast.error(errorMessage);
    }
  };

  const handleUpdateClick = (book) => {
    setSelectedBook(book);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const updateBook = async (updatedBook) => {
    try {
      const formData = new FormData();
      formData.append("title", updatedBook.title);
      formData.append("author", updatedBook.author);
      formData.append("genre", updatedBook.genre);
      if (imageFile) {
        formData.append("bookImage", imageFile);
      }

      const response = await axios.patch(
        `https://library-system-backend-4rre.onrender.com/api/books/${updatedBook._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === updatedBook._id ? { ...response.data.data } : book
        )
      );

      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating book";
      toast.error(errorMessage);
    } finally {
      //Reset states
      setImageFile(null);
      setIsModalOpen(false);
      setSelectedBook(null);
    }
  };

  if (loading) {
    return <h2 className="text-center text-xl">Loading...</h2>;
  }

  if (!books.length) {
    return (
      <h2 className="text-center text-xl text-red-600">No books found!</h2>
    );
  }

  return (
    <section>
      <div className="section-title">
        <h2 className="text-blue-600 text-4xl font-bold text-center my-10">
          MY BOOKS
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
                <h3 className="text-lg font-semibold text-white">
                  {book.title}
                </h3>
                <p className="text-gray-300">Author: {book.author}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {book.genre}
                  </span>
                  <span className="ml-2 bg-slate-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {book.borrowedBy
                      ? `Borrowed by ${book.borrowedBy.name}`
                      : "Not borrowed"}
                  </span>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-blue-500 text-white font-semibold py-1 px-2 rounded"
                    onClick={() => handleUpdateClick(book)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white font-semibold py-1 px-2 rounded"
                    onClick={() => deleteBook(book._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Book</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBook(selectedBook);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={selectedBook?.title || ""}
                  onChange={(e) =>
                    setSelectedBook({ ...selectedBook, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Author
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={selectedBook?.author || ""}
                  onChange={(e) =>
                    setSelectedBook({ ...selectedBook, author: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Genre
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={selectedBook?.genre || ""}
                  onChange={(e) =>
                    setSelectedBook({ ...selectedBook, genre: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Book Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-black font-semibold py-1 px-4 rounded mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold py-1 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyBooks;
