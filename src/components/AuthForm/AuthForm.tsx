import React, { useState } from 'react';
import axios from 'axios';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import styles from './AuthForm.module.less'
import { backendBaseURL } from '../../API';

const apiClient = axios.create({
  baseURL: backendBaseURL, // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

interface PostResponse {
  title: string;
}

// listen to Auth changes
auth.onAuthStateChanged((user) => {
  console.log(user);
});

const AuthForm: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Registered successfully!');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        await sendTokenToServer(token);
        console.log('Signed in successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await sendTokenToServer(token);
      console.log('Signed in with Google successfully!');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const sendTokenToServer = async (token: string): Promise<PostResponse> => {
    console.log(token);
    try {
      const response = await apiClient.post<PostResponse>('/Verify_token', { token });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        throw error;
      } else {
        console.error('Unexpected error:', error);
        throw new Error('Unexpected error');
      }
    }
  };

  return (
    <div className={styles.auth_form}>
      {isLoading ? ( // Show loading screen if isLoading is true
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      ) : (
        <>
        <div className={styles.auth_form}>
          <h2>{isRegistering ? 'Register' : 'Sign In'}</h2>
          <form onSubmit={handleSubmit} className={styles.auth_form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">{isRegistering ? 'Register' : 'Sign In'}</button>
          </form>
          <button onClick={handleGoogleSignIn}>Sign In with Google</button>
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Switch to Sign In' : 'Switch to Register'}
          </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm;
