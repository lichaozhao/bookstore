import { useState, type FormEvent } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';

interface LoginResponse {
  token?: string;
  message?: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      const res = await fetch(apiUrl('/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json() as LoginResponse;
      if (!res.ok || !data.token) throw new Error(data.message || 'Login failed');
      dispatch(setUser({ token: data.token, username }));
      navigate('/favorites');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
      <button id="login" type="submit">Login</button>
    </form>
  );
};

export default Login;
