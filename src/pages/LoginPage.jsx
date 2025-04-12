// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert"; // Assuming you have an Alert component
import { AuthStore } from "../store/Store"; // Adjust the import path as necessary
import { loginUser } from "../Services/LoginService"; // Adjust the import path as necessary
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // In real app, use password input
  const [error, setError] = useState("");
  const setLogin = AuthStore((state) => state.setLogin);
  const setToken = (newToken) => AuthStore.setState({ token: newToken });

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/"; // Redirect to intended page or home
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    const endpoint = "https://backend-bhww.onrender.com/api/auth/login";
    loginUser(username, password, endpoint)
      .then((data) => {
        setLoading(true);
        setLogin(data);
        setToken(data.token);
      })
      .then(() => {
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/staff");
        }
      })
      .catch((error) => {});
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <Card title="Login">
        <form onSubmit={handleLogin}>
          {error && <Alert type="error" message={error} className="mb-4" />}
          <Input
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin, staff, or user"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password" // Keep as password type for UX
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
          <Button type="submit" variant="primary" className="w-full mt-4">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
