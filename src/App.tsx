import React, { useEffect, useState } from 'react';
import styles from './App.module.less';
import UpcomingExercises from './components/UpcomingExercises/UpcomingExercises';
import MyCalendar from './components/Calender/MyCalendar';
import { Run } from './model';
import NewGoal from './components/NewGoal/NewGoal';
import { auth } from './config/firebase-config'; // Adjust the path as necessary
import { onAuthStateChanged, User, getIdToken, signOut  } from 'firebase/auth';
import AuthForm from './components/AuthForm/AuthForm';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // need to make sure this is ok

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json'
  }
});

interface PostResponse {
  message: string;
  uid: string;
  program?: Run[];
}

interface PostData {
  token: string;
}

const refreshToken = async () => {
  if (auth.currentUser) {
    try {
      const token = await getIdToken(auth.currentUser, true);
      /* console.log("Refreshed Token: ", token); */
    } catch (error) {
      console.error("Error refreshing token: ", error);
    }
  }
};

const checkTokenExpiry = async () => {
  if (auth.currentUser) {
    try {
      // Firebase SDK will prompt a re-authentication if the token is expired
      const token = await getIdToken(auth.currentUser, true);
      console.log("Checked and refreshed token: ", token);
    } catch (error) {
      console.error("Error checking token expiry: ", error);
    }
  }
};

const App: React.FC = () => {
  const [exercises, setExercises] = useState<Run[]>([]);
  const [user, setUser] = useState<User | null>(null);
  //const periodExercises = useMemo(() => expensiveCalculation(exercises),[exercises]);

  // UseEffect for refreshing the token
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 1 * 60 * 1000); // Refresh token every 30 minutes
  
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // UseEffect for checking validation of the token
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 2 * 60 * 1000); // Check token expiry every 5 minutes
  
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const response = await sendTokenToServer({token});
          if (response.program) {
            setExercises(response.program);
          }
        } catch (error) {
          console.error('Error getting token or sending to server:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const sendTokenToServer = async (data: PostData):Promise<PostResponse> => {
    try {
      const response = await apiClient.post<PostResponse>('/Verify_token', data);
      console.log(response.data)
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


  if (user) {
    if (!exercises.length) {
      return (
        <div className={styles.App}>
          <NewGoal user={user} setExercises = {setExercises} />
        </div>
      );
    }
    return (
      <div className={styles.App}>
        <UpcomingExercises user={user} exrecises={exercises} setExercises = {setExercises} />
        <MyCalendar user={user} exercises={exercises} setExercises = {setExercises}/>
      </div>
    );
  }

  return (
    <div className={styles.App}>
      <AuthForm />
    </div>
  );
};

export default App;
