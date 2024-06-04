import React from 'react'
import './UpcomingExercises.css'
import '../SingleExercise/SingleExercise'
import SingleExercise from '../SingleExercise/SingleExercise'
import { Exercise } from '../../model';
import { exec } from 'child_process';

interface Props{
    exrecises:Exercise[];
}

const UpcomingExercises:React.FC<Props> = ({exrecises}:Props) => {
  return (
    <div className='UpcomingExercises'>
        <div className='UpcomingExercisesHeader'>Upcoming Exrcises:</div>
    {
        exrecises.map((exrecise)=>(
            <SingleExercise
            key = {exrecise.id}
            distance = {exrecise.distance}
            date = {exrecise.date}
            isDone = {exrecise.isDone}
            />
        ))
    }
    </div>
  )
}

export default UpcomingExercises