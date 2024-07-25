import React from 'react'
import '../SingleExercise/SingleExercise'
import SingleExercise from '../SingleExercise/SingleExercise'
import { Exercise } from '../../model';
import styles from './UpcomingExercises.module.less'
import {  User, getIdToken  } from 'firebase/auth';


interface Props{
    exrecises:Exercise[];
    user:User | null;
    setExercises:React.Dispatch<React.SetStateAction<Exercise[]>>;
}



const UpcomingExercises:React.FC<Props> = ({exrecises,user,setExercises}:Props) => {
  return (
    <div className={styles.UpcomingExercises}>
        <div className={styles.UpcomingExercisesHeader}>Upcoming Exrcises:</div>
    {
        exrecises.map((exrecise)=>{
            const {id,distance,date,isDone} = exrecise
            return <SingleExercise
              user = {user}
              setExercises = {setExercises}
              id = {id}
              distance = {distance}
              date = {date}
              isDone = {isDone}
            />
        }
      )
    }
    </div>
  )
}

export default UpcomingExercises