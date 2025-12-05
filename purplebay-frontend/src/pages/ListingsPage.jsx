import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { loginValidator } from "../utils/validators";

export default function Login() {
  const { login } = useContext(AuthContext); // Getting login function from global auth context
  const nav = useNavigate(); // Used to redirect user after login

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Storing form validation errors

  // Handling login form submission
  const submit = async (e) => {
    e.preventDefault();
    try {
      // Validating form fields
      await loginValidator.validate({ email, password }, { abortEarly: false });

      // Sending login request
      const res = await apiLogin(email, password);

      // Saving token to local storage
      if (res.token) localStorage.setItem("token", res.token);

      // Logging user into global context
      await login(res.user || {});

      // Redirecting to homepage
      nav("/");
    } catch (err) {
      // Handling validation errors
      if (err.inner) {
        const errs = {};
        err.inner.forEach((e) => (errs[e.path] = e.message));
        setErrors(errs);
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="w-50 mx-auto mt-4">
      <h3>Login</h3>
      <form onSubmit={submit}>
        {/* Input for user email */}
        <input
          className="form-control my-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <small className="text-danger">{errors.email}</small>}

        {/* Input for user password */}
        <input
          className="form-control my-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <small className="text-danger">{errors.password}</small>
        )}

        {/* Login button */}
        <button className="btn btn-primary mt-2">Login</button>
      </form>
    </div>
  );
}
