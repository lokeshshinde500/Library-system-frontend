import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import Home from "../pages/Home";
import MyBooks from "../pages/MyBooks";
import BorrowedBooks from "../pages/BorrowedBooks";
import Navbar from "../components/Navbar";
import AddBooks from "../pages/AddBooks";
import PrivateRoutes from "./PrivateRoutes";

function AllRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route
          path="/home"
          element={
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          }
        />
        <Route
          path="/myBooks"
          element={
            <PrivateRoutes>
              <MyBooks />
            </PrivateRoutes>
          }
        />
        <Route
          path="/borrowedBooks"
          element={
            <PrivateRoutes>
              <BorrowedBooks />
            </PrivateRoutes>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoutes>
              <AddBooks />
            </PrivateRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default AllRoutes;
