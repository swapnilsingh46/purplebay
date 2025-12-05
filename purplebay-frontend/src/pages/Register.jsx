import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { registerValidator } from "../utils/validators";

export default function Register() {
  const nav = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error handling
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  // Form submit handler
  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");

    try {
      // Client-side validation using Yup
      await registerValidator.validate(
        { name, email, password },
        { abortEarly: false }
      );

      // Call API to register user
      await register({ name, email, password });

      // Navigate to login page on success
      nav("/login");
    } catch (err) {
      // Handle validation errors
      if (err.inner) {
        const errs = {};
        err.inner.forEach((e) => (errs[e.path] = e.message));
        setErrors(errs);
      } 
      // Handle backend errors
      else if (err.response?.status === 400 && err.response?.data?.msg) {
        const msg = err.response.data.msg;
        if (msg.toLowerCase().includes("email")) {
          setBackendError("This email already has an account");
        } else {
          setBackendError(msg);
        }
      } 
      // Generic error fallback
      else {
        setBackendError("Registration failed, try again");
        console.error(err);
      }
    }
  };

  return (
    <div className="w-50 mx-auto mt-5">
      <h3 className="mb-3">Create Account</h3>
      <form onSubmit={submit}>
        {/* Name input */}
        <input
          className="form-control my-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <small className="text-danger">{errors.name}</small>}

        {/* Email input */}
        <input
          className="form-control my-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <small className="text-danger">{errors.email}</small>}
        {backendError && <div className="text-danger small mt-1">{backendError}</div>}

        {/* Password input */}
        <input
          className="form-control my-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <small className="text-danger">{errors.password}</small>}

        {/* Submit button */}
        <button className="btn btn-primary mt-3 w-100">Sign Up</button>
      </form>
    </div>
  );
}

