import React from 'react'
import './UpcomingExercises.css'
import '../SingleExercise/SingleExercise'
import SingleExercise from '../SingleExercise/SingleExercise'
import { Exercise } from '../../model';

interface Props{
    exrecises:Exercise[];
}

const UpcomingExercises:React.FC<Props> = ({exrecises}:Props) => {
  return (
    <div className='UpcomingExercises'>
        <div className='UpcomingExercisesHeader'>Upcoming Exrcises:</div>
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