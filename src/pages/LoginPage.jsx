// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert'; // Assuming you have an Alert component

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // In real app, use password input
  const [error, setError] = useState('');

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/"; // Redirect to intended page or home

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- SIMULATED LOGIN ---
    // Replace this with actual API call in real application
    let simulatedUser = null;
    if (username === 'admin' && password === 'password') {
      simulatedUser = { name: 'Admin User', role: 'admin' };
    } else if (username === 'staff' && password === 'password') {
       simulatedUser = { name: 'Staff Member', role: 'staff' };
    } else if (username === 'user' && password === 'password') { // Generic logged-in user
        simulatedUser = { name: 'Guest User', role: 'guest' }; // Role could be 'user' or 'guest'
    }

    if (simulatedUser) {
      login(simulatedUser);
      navigate(from, { replace: true }); // Redirect after successful login
    } else {
      setError('Invalid username or password (Hint: try admin/password or staff/password)');
    }
    // --- END SIMULATED LOGIN ---
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