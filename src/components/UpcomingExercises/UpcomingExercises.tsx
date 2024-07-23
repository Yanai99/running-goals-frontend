import React from 'react'
import '../SingleExercise/SingleExercise'
import SingleExercise from '../SingleExercise/SingleExercise'
import { Exercise } from '../../model';
import styles from './UpcomingExercises.module.less'

interface Props{
    exrecises:Exercise[];
}

const UpcomingExercises:React.FC<Props> = ({exrecises}:Props) => {
  return (
    <div className={styles.UpcomingExercises}>
        <div className={styles.UpcomingExercisesHeader}>Upcoming Exrcises:</div>
    {
        exrecises.map((exrecise)=>{
            const {id,distance,date,isDone} = exrecise
            return <SingleExercise
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