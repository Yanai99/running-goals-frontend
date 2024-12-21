import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import styles from './SettingsModal.module.less'
import { userSettings } from '../../../model';
import axios from 'axios';
import { backendBaseURL } from '../../../API';
import { User } from 'firebase/auth';


interface PostData {
  currentDateFormat:string;
  currentDistanceUnit:string;
  idToken: any;
}

interface PostResponse {
  userSettings: userSettings;
}

interface SettingsModalProps{
    isSettingsModalOpen:boolean;
    setSettingsModalIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    userSettings:userSettings;
    setSettings:React.Dispatch<React.SetStateAction<userSettings>>;
    user:User|null;
}

const apiClient = axios.create({
  baseURL: backendBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPostNewGoal = async (
  data: PostData,
  setSettings: React.Dispatch<React.SetStateAction<userSettings>>
): Promise<PostResponse> => {
  try {
    const response = await apiClient.post<PostResponse>('/set_settings', data);
    console.log(response.data);
    setSettings(response.data.userSettings);
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

const SettingsModal:React.FC<SettingsModalProps> = ({isSettingsModalOpen,setSettingsModalIsOpen,userSettings,setSettings,user}) => {
  const [currentDateFormat,setcurrentDateFormat] = useState<string>("")
  const [currentDistanceUnit,setcurrentDistanceUnit] = useState<string>("")
  
  const handleSetNewSettings = async (e:React.MouseEvent<HTMLButtonElement, 
    MouseEvent>,newUserSettings:userSettings,user:User|null)=>{
    setSettings(newUserSettings)
    const idToken = await user?.getIdToken();

    const postData: PostData = {
      currentDateFormat,
      currentDistanceUnit,
      idToken,
    };

    //setLoading(true); // Start loading
    try {
      await createPostNewGoal(postData, setSettings);
      setSettingsModalIsOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      //setLoading(false); // End loading
    }
  }

  useEffect(() => {
    if (isSettingsModalOpen && userSettings) {
      setcurrentDateFormat(userSettings.dateFormat);
      setcurrentDistanceUnit(userSettings.distanceUnit)
    }
  }, [isSettingsModalOpen,userSettings]);

  return (
    <Modal className={styles.settings_modal}
    isOpen = {isSettingsModalOpen}
    onRequestClose={()=>setSettingsModalIsOpen(false)}
    >
      <div>
        <h3>Settings:</h3>
        <div className={styles.radio_options_container}>
        <p className={styles.settings_text}>date format:</p>

        <button className={currentDateFormat === 'dd/mm/yyyy'? styles.button_active:styles.button_inactive}
        onClick={()=>{setcurrentDateFormat('dd/mm/yyyy')}}>dd/mm/yyyy</button>
        <button className={currentDateFormat === 'mm/dd/yyyy'? styles.button_active:styles.button_inactive}
        onClick={()=>{setcurrentDateFormat('mm/dd/yyyy')}}>mm/dd/yyyy</button>
        </div>
      </div>

      <div className={styles.radio_options_container}>
        <p>distance unit:</p>
      <div className={styles.radio_buttons_container}>
        <button className={currentDistanceUnit === 'km'? styles.button_active:styles.button_inactive}
         onClick={()=>{setcurrentDistanceUnit('km')}}>km</button>
        <button className={currentDistanceUnit === 'mil'? styles.button_active:styles.button_inactive}
         onClick={()=>{setcurrentDistanceUnit('mil')}}>mil</button>
      </div>
      </div>
        <div className={styles.centered_container}>
          <label>this actions is not reversible!</label>
          <button className={styles.reset_button}>reset current Program</button>
        </div>

        <div className={styles.modal_buttons_container}>
          <button className={styles.bottom_modal_button} onClick={()=>setSettingsModalIsOpen(false)}>Cancel</button>
          <button className={styles.bottom_modal_button} onClick={(e)=>handleSetNewSettings(e,{distanceUnit:currentDistanceUnit,dateFormat:currentDateFormat},
            user)}>
            Submit</button>
        </div>
      
    </Modal>
  )
}

export default SettingsModal;

/*
1. date format
2. distance measurment
3. reset current plan
*/