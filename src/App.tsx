import React, { useEffect, useState } from 'react';
import styles from './App.module.less';
import UpcomingExercises from './components/UpcomingExercises/UpcomingExercises';
import MyCalendar from './components/Calender/MyCalendar';
import { Run,userSettings } from './model';
import NewGoal from './components/NewGoal/NewGoal';
import { auth } from './config/firebase-config'; // Adjust the path as necessary
import { onAuthStateChanged, User, getIdToken} from 'firebase/auth';
import AuthForm from './components/AuthForm/AuthForm';
import axios from 'axios';
import Modal from 'react-modal';
import NavBar from './components/NavBar/NavBar';
import { backendBaseURL } from './API';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import SettingsModal from './components/NavBar/SettingsModal/SettingsModal';
import InfoModal from './components/NavBar/InfoModal/InfoModal';


Modal.setAppElement('#root'); // need to make sure this is ok

const apiClient = axios.create({
  baseURL: backendBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface PostResponse {
  message: string;
  uid: string;
  program?: Run[];
  userSettings?:userSettings;
}

interface PostData {
  token: string;
}

const refreshToken = async () => {
  if (auth.currentUser) {
    try {
      const token = await getIdToken(auth.currentUser, true);
    } catch (error) {
      console.error('Error refreshing token: ', error);
    }
  }
};

const checkTokenExpiry = async () => {
  if (auth.currentUser) {
    try {
      const token = await getIdToken(auth.currentUser, true);
      console.log('Checked and refreshed token: ', token);
    } catch (error) {
      console.error('Error checking token expiry: ', error);
    }
  }
};

const App: React.FC = () => {
  const [exercises, setExercises] = useState<Run[]>([]);
  const [settings, setSettings] = useState<userSettings>({dateFormat:"",distanceUnit:""});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isSettingsModalOpen,setSettingsModalIsOpen] = useState<boolean>(false);
  const [isInfoModalOpen,setInfoModalIsOpen] = useState<boolean>(false);


  // UseEffect for refreshing the token
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // UseEffect for checking validation of the token
  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Initial signing and goal fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          setLoading(true);
          const token = await currentUser.getIdToken();
          const response = await sendTokenToServer({ token });
          if (response.program && response.userSettings) {
            setExercises(response.program);
            setSettings(response.userSettings)
          }
        } catch (error) {
          console.error('Error getting token or sending to server:', error);
        } finally {
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  const sendTokenToServer = async (data: PostData): Promise<PostResponse> => {
    try {
      const response = await apiClient.post<PostResponse>('/Verify_token', data);
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

  if (loading) {
    return (
      <div className={styles.loading_screen}>
        <LoadingScreen/>
      </div>
    );
  }

  if (user) {
    if (!exercises.length || exercises[exercises.length - 1].isDone) {
      // No current goal
      return (
        <div>
          <NavBar profileLetter={user?.displayName?.charAt(0).toUpperCase() || "?"} 
          isSignOutButton={true} isSettingsButton = {true} setExercises={setExercises} setUser={setUser} 
          setSettingsModalIsOpen={setSettingsModalIsOpen} setInfoModalIsOpen={setInfoModalIsOpen}></NavBar>
        <div className={styles.App}>
          <NewGoal user={user} setExercises={setExercises} />
        </div>
        </div>
      );
    }
    return (
      <div>
        <NavBar profileLetter={user?.displayName?.charAt(0).toUpperCase() || "?"} 
        isSignOutButton={true} isSettingsButton = {true} setExercises={setExercises} setUser={setUser} 
        setSettingsModalIsOpen={setSettingsModalIsOpen} setInfoModalIsOpen={setInfoModalIsOpen}></NavBar>
        <div className={styles.App}>
          <UpcomingExercises user={user} exrecises={exercises} setExercises={setExercises} />
          <MyCalendar user={user} exercises={exercises} setExercises={setExercises} />
        </div>
          <SettingsModal
          user={user}
          isSettingsModalOpen = {isSettingsModalOpen}
          setSettingsModalIsOpen= {setSettingsModalIsOpen}
          userSettings={settings}
          setSettings={setSettings}
          />
          <InfoModal
          isInfoModalOpen = {isInfoModalOpen}
          setInfoModalIsOpen={setInfoModalIsOpen}
          />
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
