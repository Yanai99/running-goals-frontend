import React, { useState,useEffect } from 'react';
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
import { backendBaseURL } from '../../API';
import { EditModal } from './EditModal/EditModal';

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
  baseURL: backendBaseURL, // Replace with your actual API base URL
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

const MyCalendar: React.FC<MyCalendarProps> = ({exercises,user,setExercises}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // states of edit modal
  const [editModeIsOpen,setEditModeIsOpen] = useState(false);
  const [editedRun, setEditedRun] = useState<Run | undefined>()
  const [isDoneOption, setIsDoneOption] = useState<string>("Done")
  const [dateOption, setDateOption] = useState<string>("")
  const [distanceOption, setDistanceOption] = useState<string>("") // need to handle the initital value

  const onDateClick = (value: Date) => {
    setSelectedDate(value);
    setModalIsOpen(true);
  };

  const handleEditPressed = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,
    editedRun:Run | undefined) => {
      setEditedRun(editedRun);
      
      if(editedRun?.distance[1] === ' '){
        setDistanceOption(editedRun?.distance[0] || '1')
      }else{
        setDistanceOption(editedRun?.distance.substring(0, 2) || '1')
      }
      if(editedRun?.isDone){
        setIsDoneOption("Done");
      }else{
        setIsDoneOption("Not Done");
      }
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
        return {id:editedRun.id,
                distance:editedRun.distance,
                date:editedRun.date,
                status:"",
                pace:"",
                isDone:editedRun.isDone,
                isGoal:editedRun.isGoal};
      }
      else 
        return run;
    })
    setExercises(updatedExrecises) 
    const idToken = await  user?.getIdToken()
    e.preventDefault();
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

  // Function to go to the previous month
  const handlePreviousMonth = () => {
    const newDate = new Date(
      activeStartDate.getFullYear(),
      activeStartDate.getMonth() - 1
    );
    setActiveStartDate(newDate);
  };

  // Function to go to the next month
  const handleNextMonth = () => {
    const newDate = new Date(
      activeStartDate.getFullYear(),
      activeStartDate.getMonth() + 1
    );
    setActiveStartDate(newDate);
  };

  return (
    <div>
      <Calendar
        onClickDay={onDateClick}
        tileContent={tileContent}
        activeStartDate={activeStartDate}
        showNavigation = {false}
        locale="en-US" // makes so the week starts from sunday, add a toggle button for that
      />
      <div className={styles.calendar_navigation_bar}>
        <button className={styles.prev_month_button} onClick={handlePreviousMonth }>&#9668;</button>
        <span className={styles.calendar_bottom_text}>
            {activeStartDate.toLocaleString('default', { month: 'long' })}{' '}
            {activeStartDate.getFullYear()}
        </span>
        <button className={styles.next_month_button} onClick={handleNextMonth}>&#9658;</button>
      </div>

      <Modal // main modal
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
                <li key={exercise.id}>
                  {exercise.distance} {exercise.isDone ? 'Done' : null}
                  <button onClick={(e) => handleEditPressed(e, exercise)}>Edit</button>
                </li>
              ))}
              {exercises.filter(exercise => {
                const exerciseDate = new Date(exercise.date);
                return exerciseDate.toDateString() === selectedDate.toDateString();
              }).length === 0 && (
                <h1>no run</h1>
              )}
            </ul>
            <button onClick={() => setModalIsOpen(false)}>Close</button>           
          </div>
        )}
      </Modal>

      <EditModal
        exercises={exercises}
        editModeIsOpen={editModeIsOpen}
        setEditModeIsOpen={setEditModeIsOpen}
        setModalIsOpen={setModalIsOpen}
        selectedDate={selectedDate}
        isDoneOption={isDoneOption}
        setIsDoneOption={setIsDoneOption}
        distanceOption={distanceOption}
        setDistanceOption={setDistanceOption}
        setDateOption={setDateOption}
        handleDistanceChange={handleDistanceChange}
        handleEditSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default MyCalendar;
