import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/"); // Redirect to home or login page after logout
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">My Logo</div>
        <div className="hidden md:flex space-x-4">
          <Link to="/home" className="text-white hover:text-blue-300">
            Home
          </Link>
          <Link to="/borrowedBooks" className="text-white hover:text-blue-300">
            Borrowed Books
          </Link>
          <Link to="/myBooks" className="text-white hover:text-blue-300">
            My Books
          </Link>
          <Link to="/add" className="text-white hover:text-blue-300">
            Add Books
          </Link>
          <Link
            to="/"
            className="text-white hover:text-blue-300"
            onClick={logout}
          >
            Logout
          </Link>
        </div>
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <Link to="/home" className="block text-white hover:text-blue-300 p-2">
            Home
          </Link>
          <Link
            to="/borrowedBooks"
            className="block text-white hover:text-blue-300 p-2"
          >
            Borrowed Books
          </Link>
          <Link
            to="/myBooks"
            className="block text-white hover:text-blue-300 p-2"
          >
            My Books
          </Link>
          <Link to="/add" className="block text-white hover:text-blue-300 p-2">
            Add Books
          </Link>
          <Link
            to="/"
            className="block text-white hover:text-blue-300 p-2"
            onClick={logout}
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
