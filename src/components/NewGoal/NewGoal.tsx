import React, { useState } from 'react';
import axios from 'axios';
import styles from './NewGoal.module.less';
import { Run } from '../../model';
import { User } from 'firebase/auth';
import { backendBaseURL } from '../../API';
interface PostData {
  idToken: any;
  avgWeeklyKilometer: number;
  distance: number;
  startDate: string;
  preferredDays: string[];
  excludedDays: string[];
}

interface PostResponse {
  program: Run[];
}

interface Props {
  user: User | null;
  setExercises: React.Dispatch<React.SetStateAction<Run[]>>;
}

const apiClient = axios.create({
  baseURL: backendBaseURL, // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPostNewGoal = async (
  data: PostData,
  setExercises: React.Dispatch<React.SetStateAction<Run[]>>
): Promise<PostResponse> => {
  try {
    const response = await apiClient.post<PostResponse>('/new_goal_plan', data);
    console.log(response.data);
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

const NewGoal: React.FC<Props> = ({ user, setExercises }: Props) => {
  const [avgWeeklyKilometer, setCurrentAvgWeeklKilometer] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [numOfRunsInWeek, setNumOfRunsInWeek] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>('');
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [excludedDays, setExcludedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleDaySelection = (
    day: string,
    listSetter: React.Dispatch<React.SetStateAction<string[]>>,
    currentList: string[]
  ) => {
    if (currentList.includes(day)) {
      listSetter(currentList.filter((d) => d !== day));
    } else {
      listSetter([...currentList, day]);
    }
  };

  const handleSetNewGoal = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    avgWeeklyKilometer: number,
    distance: number,
    startDate: string,
    user: User | null,
    setExercises: React.Dispatch<React.SetStateAction<Run[]>>
  ) => {
    e.preventDefault();
    const idToken = await user?.getIdToken();

    const postData: PostData = {
      avgWeeklyKilometer,
      distance,
      startDate,
      preferredDays,
      excludedDays,
      idToken,
    };

    setLoading(true); // Start loading
    try {
      const postResponse = await createPostNewGoal(postData, setExercises);
      console.log(postResponse);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className={styles.new_goal_div}>
      {loading ? (
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <h2>New Goal</h2>
          <form className={styles.new_goal_form}>
            <div className={styles.new_goal_input_field}>
              <label>What is your avg weekly kilometer?:</label>
              <input
                type="number"
                required
                value={avgWeeklyKilometer}
                onChange={(e) => setCurrentAvgWeeklKilometer(parseFloat(e.target.value))}
              />
            </div>

            <div className={styles.new_goal_input_field}>
              <label>What is your Goal?:</label>
              <input
                type="number"
                required
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
              />
            </div>

            <div className={styles.new_goal_input_field}>
              <label>How many runs would you like to do a week?:</label>
              <input
                type="number"
                required
                value={numOfRunsInWeek}
                onChange={(e) => setNumOfRunsInWeek(parseFloat(e.target.value))}
              />
            </div>

            <div className={styles.new_goal_input_field}>
              <label>When would you like to start the program?</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className={styles.new_goal_input_field}>
              <label>Preferred Days to Run:</label>
              <div className={styles.new_goal_input_days}>
                {daysOfWeek.map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={preferredDays.includes(day)}
                      onChange={() => handleDaySelection(day, setPreferredDays, preferredDays)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.new_goal_input_field}>
              <label>Days to Exclude:</label>
              <div className={styles.new_goal_input_days}>
                {daysOfWeek.map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={excludedDays.includes(day)}
                      onChange={() => handleDaySelection(day, setExcludedDays, excludedDays)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <button
              className={styles.new_goal_button}
              onClick={(e) => handleSetNewGoal(e, avgWeeklyKilometer, distance, startDate, user, setExercises)}
            >
              Set Goal!
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default NewGoal;

/** 
 * 
 * 1. add validation for included and excluded days
 * 2. change all numbers format same as in edit modal
*/