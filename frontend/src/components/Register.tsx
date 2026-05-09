import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';

interface RegisterResponse {
  message?: string;
}

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(apiUrl('/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json() as RegisterResponse;
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={event => setUsername(event.target.value)}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        required
      />
      <button id="register" type="submit">Register</button>
    </form>
  );
};

export default Register;
