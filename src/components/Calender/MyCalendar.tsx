import React,{ useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Exercise } from '../../model';
import './custom-calendar.css'; // Import your custom CSS
import 'react-calendar/dist/Calendar.css'; // Import default styles
import Modal from 'react-modal';
import { User } from 'firebase/auth';


interface MyCalendarProps {
  exercises: Exercise[];
  user:User | null;
}

interface MyCalendarProps {
  exercises: Exercise[];
}

const MyCalendar: React.FC<MyCalendarProps> = ({ exercises }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const onDateClick = (value: Date) => {
    setSelectedDate(value);
    setModalIsOpen(true);
  };

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month' && exercises.some(exercise => {
      const exerciseDate = new Date(exercise.date);
      return exerciseDate.toDateString() === date.toDateString();
    })) {
      return <span className="dot"><br/></span>;
    }
  };

  return (
    <div>
      <Calendar
        onClickDay={onDateClick}
        tileContent={tileContent}
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
                <li key={exercise.id}>{exercise.distance} - {exercise.isDone ? 'Done' : 'Pending'}</li>
              ))}
            </ul>
            <button onClick={() => setModalIsOpen(false)}>Close</button>
            <button onClick={() => setModalIsOpen(false)}>Edit</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyCalendar;