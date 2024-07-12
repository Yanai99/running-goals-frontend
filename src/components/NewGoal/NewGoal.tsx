import React,{useState} from 'react'
import axios from 'axios';
import styles from './NewGoal.module.less'
import { Exercise } from '../../model'
import { User } from 'firebase/auth';

interface PostData {
  idToken: any;
  currentLevel: string;
  distance: number;
  startDate: string;
  endDate: string;
}

interface PostResponse {
  program: Exercise[];
}
interface Props{
   user:User | null;
   setExercises:React.Dispatch<React.SetStateAction<Exercise[]>>;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createPostNewGoal = async (data: PostData,setExercises:React.Dispatch<React.SetStateAction<Exercise[]>>): Promise<PostResponse> => {
  try {
    const response = await apiClient.post<PostResponse>('/new_goal_plan', data);
    console.log(response.data)
    setExercises(response.data.program);
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

const NewGoal:React.FC<Props> = ({user,setExercises}:Props) => {
  const [currentLevel,setCurrentLevel] = useState<string>("default");
  const [distance,setDistance] = useState<number>(0);
  const [startDate,setStartDate] = useState<string>("");
  const [endDate,setEndDate] = useState<string>("");

  const handleCurrentLevelChange = (currentLevel:string)=>{
    setCurrentLevel(currentLevel);
  }

  const handleDistanceChange = (distance:string)=>{
    setDistance(parseFloat(distance));
  }

  const handleStartDateChange = (startDate:string)=>{
    console.log(startDate)
    setStartDate(startDate);
  }

  const handleEndDateChange = (endDate:string)=>{
    setEndDate(endDate);
  }

  const handleSetNewGoal = 
   async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>
    ,frequency:string,distance:number,startDate:string,endDate:string,user:User | null,
    setExercises:React.Dispatch<React.SetStateAction<Exercise[]>>)=>{
    const idToken = await  user?.getIdToken()
    e.preventDefault();
    console.log(frequency,distance,startDate,endDate,user?.getIdToken());
    const postData = {
      currentLevel,
      distance,
      startDate,
      endDate,
      idToken,
    };

    try {
      const postResponse = createPostNewGoal(postData,setExercises); // what is this?
      console.log(postResponse);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.new_goal_div}>
      <h2>New Goal</h2>
    <form className={styles.new_goal_form}>

    <div className={styles.new_goal_input_field}>
    <label>My Current Level:</label>
      <select onChange={(e)=>handleCurrentLevelChange(e.target.value)}>
        <option value="default" selected disabled hidden>Choose here</option>
        <option value="beginner">Beginner</option>
        <option value="intermidiate">Intermidiate</option>
        <option value="pro">Pro</option>
      </select>
      </div>

      <div className={styles.new_goal_input_field}>
      <label>Distance:</label>
        <input 
        type="number"
        required 
        value = {distance}
        onChange={(e)=>handleDistanceChange(e.target.value)}
        />
        </div>

        <div className={styles.new_goal_input_field}>
      <label>Date Of Start:</label>
            <input 
            type="date"
            required 
            value={startDate}
            onChange={(e)=>handleStartDateChange(e.target.value)}
            />
        </div>

        <div className={styles.new_goal_input_field}>
          <label>Date Of Goal:</label>
            <input 
            type="date"
            required 
            value={endDate}
            onChange={(e)=>handleEndDateChange(e.target.value)}
            />
        </div>

        <button
        onClick={(e)=>handleSetNewGoal(e,currentLevel,distance,startDate,endDate,user,setExercises)}
        >Set Goal!</button>
    </form>
    </div>

  )
}

export default NewGoal