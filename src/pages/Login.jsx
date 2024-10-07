import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://library-system-backend-4rre.onrender.com/api/auth/login",
        { email, password }
      );
      if (response.data.success) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Signup failed");
      setSnackbarSeverity("error");
    } finally {
      setEmail("");
      setPassword("");
      setOpenSnackbar(true);
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            Signup
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            New user ?{" "}
            <Link
              to="/signUp"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
