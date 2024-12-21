import React from 'react';
import Modal from 'react-modal';
import styles from './MainModal.module.less';
import { Run } from '../../../model';

interface MainModalProps {
    modalIsOpen:boolean;
    setModalIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    selectedDate:Date | null;
    exercises:Run[];
    handleEditPressed:(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, editedRun: Run | undefined) => Promise<void>;
  }

const MainModal:React.FC<MainModalProps> = ({modalIsOpen,setModalIsOpen,selectedDate,
    exercises,handleEditPressed}) => {
  return (
    <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setModalIsOpen(false)}
    contentLabel={styles.main_modal}
    className={styles.main_modal}>        
    {selectedDate && (
      <div className={styles.modal_content_container}>
        <h2>Exercises on {selectedDate.toDateString()}</h2>
          {exercises.filter(exercise => {
            const exerciseDate = new Date(exercise.date);
            return exerciseDate.toDateString() === selectedDate.toDateString();
          }).map(exercise => (
            <div className={styles.detailes_row} key={exercise.id}>
              Distance to run: {exercise.distance} {exercise.isDone ? 'Done' : null}
              <button className={styles.bottom_modal_button} 
              onClick={(e) => handleEditPressed(e, exercise)}>Edit</button>
            </div>
          ))}
          {exercises.filter(exercise => {
            const exerciseDate = new Date(exercise.date);
            return exerciseDate.toDateString() === selectedDate.toDateString();
          }).length === 0 && (
            <div className={styles.detailes_row_no_run}>
                <h3>Rest Day</h3>
            </div>
          )}
        <div className={styles.main_modal_buttons_container}>
            <button className={styles.bottom_modal_button} onClick={() => setModalIsOpen(false)}>Close</button>           
        </div>
      </div>
    )}</Modal>
  )
}

export default MainModal;