import React, { useMemo,useEffect, useState } from 'react';
import styles from './App.module.less';
import UpcomingExercises from './components/UpcomingExercises/UpcomingExercises';
import { Exercise } from './model';
import isDateInCurrentWeek from './WeekFunctions';
import NewGoal from './components/NewGoal/NewGoal';
import { auth } from './config/firebase-config'; // Adjust the path as necessary
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthForm from './components/AuthForm/AuthForm';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json'
  }
});

interface PostResponse {
  message: string;
  uid: string;
  program?: Exercise[];
}

interface PostData {
  token: string;
}

/* function expensiveCalculation(exercises:Exercise[]){
  return exercises.filter(exercise => isDateInCurrentWeek(exercise.date)) 
} */

const App: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [user, setUser] = useState<User | null>(null);
  //const periodExercises = useMemo(() => expensiveCalculation(exercises),[exercises]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          console.log(user?.displayName);
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
    console.log(data);
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

  const handleUpcoming = (exercises: Exercise[]): Exercise[] => {
    return exercises.filter(exercise => isDateInCurrentWeek(exercise.date));
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
        <UpcomingExercises exrecises={handleUpcoming(exercises)} />
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
