import React from 'react'
import '../SingleExercise/SingleExercise'
import SingleExercise from '../SingleExercise/SingleExercise'
import { Run } from '../../model';
import styles from './UpcomingExercises.module.less'
import {  User, getIdToken  } from 'firebase/auth';
import axios from 'axios';
import {isDateInCurrentWeek} from '../../WeekFunctions';


interface Props{
    exrecises:Run[];
    user:User | null;
    setExercises:React.Dispatch<React.SetStateAction<Run[]>>;
}
interface PostData {
  idToken: any;
  idRun: string;
}

interface PostResponse {
  response: string;
  program: Run[];
}

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

const handleHowManyRemain = (exercises: Run[]) => {
  const upcomingRunnings = handleUpcoming(exercises);
  for(let i = 0; i< upcomingRunnings.length; i++){
    if(!upcomingRunnings[i].isDone)
      return false;
  }
  return true;
}

const handleUpcoming = (exercises: Run[]): Run[] => {
  return exercises.filter(exercise => isDateInCurrentWeek(exercise.date));
};

export const markRunAsDone = async (data: PostData,setExercises:React.Dispatch<React.SetStateAction<Run[]>>): Promise<PostResponse> => {
  try {
    const response = await apiClient.post<PostResponse>('/run_is_done', data);
    console.log(response.data)
    // need to se Exercises first and then send to server. -Ask Zoe about db incosistencies.
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

const UpcomingExercises:React.FC<Props> = ({exrecises,user,setExercises}:Props) => {

  const handleDonePressed = 
  async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,
    idRun:string,user:User | null)=>{
    const updatedExrecises = exrecises.map(run =>{
      if(run.id === idRun){
        return {id:run.id,distance:run.distance,date:run.date,isDone:true};
      }
      else 
        return run;
    })
    console.log(handleUpcoming(exrecises));
    setExercises(updatedExrecises)
    const idToken = await  user?.getIdToken()
    e.preventDefault();

    const postData = {
      idToken,
      idRun
    }; 
    
    try {
      const postResponse = await markRunAsDone(postData,setExercises);
      console.log(postResponse);
    } catch (err) {
      console.log(err);
    }
  }

  const upcomingRunnings= handleUpcoming(exrecises);
  return (
    <div className={styles.UpcomingExercises}>
        <div className={styles.UpcomingExercisesHeader}>Upcoming Exrcises:</div>
              {
                  upcomingRunnings.map((exrecise)=>{
                      const {id,distance,date,isDone} = exrecise
                      return <SingleExercise
                        key={id}
                        user = {user}
                        handleDonePressed = {handleDonePressed}
                        id = {id}
                        distance = {distance}
                        date = {date}
                        isDone = {isDone}
                      />
                  }
                )
              }
              {handleHowManyRemain(upcomingRunnings) && <div>all done for the week!</div>}
    </div>
  )
}

export default UpcomingExercises