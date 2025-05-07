// src/LoginPage.jsx
import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate(); // ✅ Needed for redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Loading...');

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMsg('Account created & logged in ✅');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMsg('Logged in successfully ✅');
      }

      // ✅ Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {isSignup ? 'Create Account' : 'Login'}
        </button>
      </form>
      <p style={styles.toggleText}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsSignup(!isSignup)} style={styles.link}>
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
      <p style={styles.message}>{msg}</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '360px',
    margin: '100px auto',
    padding: '24px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  toggleText: {
    marginTop: '12px',
    fontSize: '14px',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
  },
  message: {
    marginTop: '16px',
    color: 'green',
    fontSize: '14px',
    minHeight: '20px',
  },
};

export default LoginPage;
