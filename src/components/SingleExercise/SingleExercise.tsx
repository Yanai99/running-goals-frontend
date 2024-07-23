import React from 'react'
import styles from './SingleExercise.module.less'

interface Props{
  id:string
  distance:string;
  date:string;
  isDone:boolean;
}

const SingleExercise:React.FC<Props> = ({distance,date,isDone}:Props) => {
  return (
    <div className={styles.single_exercise}>
      <div className={styles.exrecise_text}>
        {distance}
      </div>
      <div className={styles.exrecise_text}>
        {date}
      </div>
      <button className={styles.exrecise_button}>Done</button>
    </div>
  )
}

export default SingleExercise