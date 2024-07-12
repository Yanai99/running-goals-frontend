import React from 'react'
import './SingleExercise.css'

interface Props{
  id:string
  distance:string;
  date:string;
  isDone:boolean;
}

const SingleExercise:React.FC<Props> = ({distance,date,isDone}:Props) => {
  return (
    <div className='single_exercise'>
      <div className='exrecise_text'>
        {distance}
      </div>
      <div className='exrecise_text'>
        {date}
      </div>
      <button className='exrecise_button'>Done</button>
    </div>
  )
}

export default SingleExercise