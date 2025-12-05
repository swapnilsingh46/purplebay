import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { loginValidator } from "../utils/validators";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    try {
      await loginValidator.validate({ email, password }, { abortEarly: false });
      const res = await apiLogin(email, password);
      if (res.token) localStorage.setItem("token", res.token);
      await login(res.user || {});
      nav("/");
    } catch (err) {
      if (err.inner) {
        const errs = {};
        err.inner.forEach(e => (errs[e.path] = e.message));
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
        <input className="form-control my-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        {errors.email && <small className="text-danger">{errors.email}</small>}

        <input className="form-control my-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {errors.password && <small className="text-danger">{errors.password}</small>}

        <button className="btn btn-primary mt-2">Login</button>
      </form>
    </div>
  );
}

