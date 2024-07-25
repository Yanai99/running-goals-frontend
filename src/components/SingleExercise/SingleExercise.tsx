import React from 'react'
import styles from './SingleExercise.module.less'
import {  User, getIdToken  } from 'firebase/auth';
import axios from 'axios';
import { Exercise } from '../../model'

interface Props{
  id:string
  distance:string;
  date:string;
  isDone:boolean;
  user:User | null;
  setExercises:React.Dispatch<React.SetStateAction<Exercise[]>>;
}

interface PostData {
  idToken: any;
  idRun: string;
}

interface PostResponse {
  response: string;
  program: Exercise[];
}

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export const markRunAsDone = async (data: PostData,setExercises:React.Dispatch<React.SetStateAction<Exercise[]>>): Promise<PostResponse> => {
  try {
    const response = await apiClient.post<PostResponse>('/run_is_done', data);
    console.log(response.data)
    //setExercises(response.data.program);
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




const SingleExercise:React.FC<Props> = ({id,distance,date,isDone,user,setExercises}:Props) => {
    
  const handleDonePressed = 
    async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,
      idRun:string,user:User | null,
    setExercises:React.Dispatch<React.SetStateAction<Exercise[]>>)=>{
      const idToken = await  user?.getIdToken()
      e.preventDefault();

      const postData = {
        idToken,
        idRun
      };
      // need to se Exercises first and then send to server. -Ask Zoe about db incosistencies. 
      
      try {
        const postResponse = await markRunAsDone(postData,setExercises);
        console.log(postResponse);
      } catch (err) {
        console.log(err);
      }
    }
  
  if(!isDone){    
    return (
    <div className={styles.single_exercise}>
      <div className={styles.exrecise_text}>
        {distance}
      </div>
      <div className={styles.exrecise_text}>
        {date}
      </div>
      <button onClick={(e)=>handleDonePressed(e,id,user,setExercises)} className={styles.exrecise_button}>Done</button>
    </div>
  )}
  return null;
}

export default SingleExercise