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
  handleDonePressed: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, idRun: string, user: User | null) => Promise<void>
}

const SingleExercise:React.FC<Props> = ({id,distance,date,isDone,user,handleDonePressed}:Props) => {
    
  if(!isDone){    
    return (
    <div className={styles.single_exercise}>
      <div className={styles.exrecise_text}>
        {distance}
      </div>
      <div className={styles.exrecise_text}>
        {date}
      </div>
      <button onClick={(e)=>handleDonePressed(e,id,user)} className={styles.exrecise_button}>Done</button>
    </div>
  )}
  return null;
}

export default SingleExercise