import React from 'react'
import { onAuthStateChanged, User, getIdToken, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase-config'; // Adjust the path as necessary
import { Run } from '../../model';
import styles from './NavBar.module.less'
import { HiOutlineLogout } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";




interface NavBarProps {
    profileLetter:string|null;
    isSignOutButton: boolean;
    isSettingsButton:boolean;
    setExercises:React.Dispatch<React.SetStateAction<Run[]>>;
    setUser:React.Dispatch<React.SetStateAction<User | null>>;
    setSettingsModalIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    setInfoModalIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar:React.FC<NavBarProps> = ({profileLetter,isSignOutButton,isSettingsButton,setExercises,setUser
    ,setSettingsModalIsOpen,setInfoModalIsOpen
 }:NavBarProps) => {
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

    const handleSettingsPressed = () => {
        setSettingsModalIsOpen(true);
    }

    const handleInfoPressed = () => {
        setInfoModalIsOpen(true);
    }
    
    return (
    <div className={styles.nav_bar}>
        <div className={styles.nav_bar_text}>
            {profileLetter}
        </div>
        <div> {/** right side div */}
        {isSettingsButton? <button className ={styles.nav_bar_button} onClick={handleSettingsPressed}><IoSettingsOutline />
        </button> : null} 
        <button className ={styles.nav_bar_button} onClick={handleInfoPressed}><IoMdInformationCircleOutline />
        </button>
        {isSignOutButton? <button className ={styles.nav_bar_button} onClick={handleSignOut}><HiOutlineLogout />
        </button> : null} 
        </div>
    </div>
  )
}

export default NavBar;