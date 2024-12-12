import React from 'react'
import { onAuthStateChanged, User, getIdToken, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase-config'; // Adjust the path as necessary
import { Run } from '../../model';

interface NavBarProps {
    isSignOutButton: boolean;
    isProfileLogo: boolean;
    setExercises:React.Dispatch<React.SetStateAction<Run[]>>;
    setUser:React.Dispatch<React.SetStateAction<User | null>>;
}

const NavBar:React.FC<NavBarProps> = ({isSignOutButton,isProfileLogo,setExercises,setUser }:NavBarProps) => {
    const handleSignOut = async () => {
        try {
          await signOut(auth);
          setUser(null);
          setExercises([]);
          console.log('Signed out successfully');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

    return (
    <div>
       {isSignOutButton? <button onClick={handleSignOut}>Sign Out</button>:null} 
    </div>
  )
}

export default NavBar;