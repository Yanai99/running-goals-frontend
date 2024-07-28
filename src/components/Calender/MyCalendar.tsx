import React, { useState } from 'react';
import Calendar from 'react-calendar';
import DatePickerComponent from '../DatePicker/DatePickerComponent';
import 'react-calendar/dist/Calendar.css';
import { Run } from '../../model';
import './custom-calendar.css';
import Modal from 'react-modal';
import { User } from 'firebase/auth';
import axios from 'axios';
import {parseDateStringForCalendar,formatDateToString} from '../../WeekFunctions'
import styles from './Calendar.module.less'

interface MyCalendarProps {
  exercises: Run[];
  user: User | null;
  setExercises:React.Dispatch<React.SetStateAction<Run[]>>;
}
interface PostData {
  idToken: any;
  newRun: Run|undefined;
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

export const editRun = async (data: PostData): Promise<PostResponse> => {
  try {
    const response = await apiClient.post<PostResponse>('/edit_run', data);
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

const extractNumFromDist = (distanceString: string): number => {
  const match = distanceString.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  throw new Error('No numerical value found in the string');
};

const MyCalendar: React.FC<MyCalendarProps> = ({exercises,user,setExercises}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editModeIsOpen,setEditModeIsOpen] = useState(false);
  const [editedRun, setEditedRun] = useState<Run | undefined>()
  const [isDoneOption, setIsDoneOption] = useState<string>("Done")
  const [dateOption, setDateOption] = useState<string>("")
  const [distanceOption, setDistanceOption] = useState<string>("1") // need to handle the initital value

  const onDateClick = (value: Date) => {
    setSelectedDate(value);
    setModalIsOpen(true);
  };

  const handleEditPressed = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,
    editedRun:Run | undefined) => {
      setEditedRun(editedRun);
      setEditModeIsOpen(true);
  }

  const handleDistanceChange = (newDistance: string) => {
    setDistanceOption(newDistance);
  }

  const handleEditSubmit = 
  async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    const updatedExrecises = exercises.map(run =>{
      if(editedRun && dateOption !== "")
        editedRun.date = formatDateToString(dateOption);

      if(editedRun && distanceOption !== ""){
        editedRun.distance = distanceOption + " km";
        console.log(editedRun.distance)
      }
        
      if(isDoneOption === 'Done' && editedRun)
        editedRun.isDone = true;
      else if(isDoneOption && editedRun)
        editedRun.isDone = false;

      if(run.id === editedRun?.id){
        return {id:editedRun.id,distance:editedRun.distance,date:editedRun.date,isDone:editedRun.isDone};
      }
      else 
        return run;
    })
    console.log(editedRun?.isDone);
    setExercises(updatedExrecises) // again updating runs before sending to server
    const idToken = await  user?.getIdToken()
    e.preventDefault();

    // maybe add a wait window - ?

    setEditModeIsOpen(false);
    setModalIsOpen(false);
    const postData = {
      idToken,
      newRun:editedRun,
    }; 
    
    try {
      const postResponse = await editRun(postData);
      console.log(postResponse);
    } catch (err) {
      console.log(err);
    }
  }

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const exercise = exercises.find(exercise => {
        const exerciseDate = new Date(exercise.date);
        return exerciseDate.toDateString() === date.toDateString();
      });
  
      if (exercise) {
        const dotClass = exercise.isDone ? 'dot-done' : 'dot-not-done';
        return (
          <div className="calendar-tile-content">
            <div className={dotClass}></div>
          </div>
        );
      }
  
      return null;
    }
  
    return null;
  };


  return (
    <div>
      <Calendar
        onClickDay={onDateClick}
        tileContent={tileContent}
        locale="en-US" // makes so the week starts from sunday, maybe add a toggle button for that
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Exercise Details"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        {selectedDate && (
          <div>
            <h2>Exercises on {selectedDate.toDateString()}</h2>
            <ul>
              {exercises.filter(exercise => {
                const exerciseDate = new Date(exercise.date);
                return exerciseDate.toDateString() === selectedDate.toDateString();
              }).map(exercise => (
                <li key={exercise.id}>{exercise.distance}  {exercise.isDone ? 'Done' : null}
                <button onClick={(e) => handleEditPressed(e,exercise)}>Edit</button> {/* add edit function */}
                </li>
              ))}
            </ul>
            <button onClick={() => setModalIsOpen(false)}>Close</button>
            <span> </span>
            
          </div>
        )}
      </Modal>

      <Modal // Modal for editing
        isOpen={editModeIsOpen}
        onRequestClose={() => {setEditModeIsOpen(false); setModalIsOpen(false)}}
        contentLabel="edit mode"
        style={{
          content: {
            padding: '15%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        {selectedDate && (
          <div>
            <h2>Editing {selectedDate.toDateString()}</h2>
            <ul>
              {exercises.filter(exercise => {
                const exerciseDate = new Date(exercise.date);
                return exerciseDate.toDateString() === selectedDate.toDateString();
              }).map(run => (
                run && (
                  <div key={run.id}>
                    <li>{run.distance}  {run.isDone ? 'Done' : 'Not Done'}</li>
                    <div> 
                      <span>Is the Run completed? </span>
                      <select
                        name="isDone"
                        id="isDone"
                        value={isDoneOption}
                        onChange={(e) => setIsDoneOption(e.target.value)}
                      >
                        <option value="Done">Yes</option>
                        <option value="Not Done">Not Yet</option>
                      </select>
                    </div>
                    <div>
                      <input type="number" 
                      value={distanceOption}
                      onChange={(e) => handleDistanceChange(e.target.value)}/>
                    </div>
                    <div className={styles.datePickerContainer}>
                      <DatePickerComponent
                      setOutSideValue={setDateOption}
                      initialValue={parseDateStringForCalendar(run.date)}
                      />
                    </div>
                  </div>
                )
              ))}
            </ul>
            <button onClick={() => setEditModeIsOpen(false)}>Cancel</button>
            <span> </span>
            <button onClick={(e) => handleEditSubmit(e)}>Submit</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyCalendar;
