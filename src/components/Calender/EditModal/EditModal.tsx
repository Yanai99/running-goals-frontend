import React from 'react'
import { Run } from '../../../model';
import styles from './EditModal.module.less'
import Modal from 'react-modal';
import {parseDateStringForCalendar} from '../../../WeekFunctions'
import DatePickerComponent from '../../DatePicker/DatePickerComponent';

interface EditModalProps {
  exercises:Run[]
  editModeIsOpen: boolean;
  setEditModeIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // edited fields and setters of the run
  selectedDate: Date | null;
  isDoneOption:string;
  setIsDoneOption:React.Dispatch<React.SetStateAction<string>>;
  distanceOption:string;
  setDistanceOption:React.Dispatch<React.SetStateAction<string>>;
  setDateOption:React.Dispatch<React.SetStateAction<string>>;

  handleDistanceChange:(newDistance: string) => void;
  handleEditSubmit:(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
}

export const EditModal: React.FC<EditModalProps> = (
  {exercises,editModeIsOpen,setEditModeIsOpen,setModalIsOpen,selectedDate,isDoneOption,
    setIsDoneOption,distanceOption,handleDistanceChange,handleEditSubmit,setDateOption
  }) => {

  return (
    <Modal // Modal for editing
    isOpen={editModeIsOpen}
    onRequestClose={() => {setEditModeIsOpen(false); setModalIsOpen(false)}}
    contentLabel={styles.edit_modal}
    className={styles.edit_modal}
  >
    {selectedDate && (
      <div className={styles.modal_content_container}>
        <div className={styles.modal_title_text}>
        <h2>Editing {selectedDate.toDateString()}</h2>
        </div>
          {exercises.filter(exercise => {
            const exerciseDate = new Date(exercise.date);
            return exerciseDate.toDateString() === selectedDate.toDateString();
          }).map(run => (
            run && (
              <div className={styles.edit_options_container}  key={run.id}>
                <div className={styles.edit_field_container}>
                  <span>Is the Run completed? </span>
                <div className={styles.radio_button_container}>
                  <div className={styles.radio_button}>
                    <input
                      type="radio"
                      id="done"
                      name="isDone"
                      value="Done"
                      className={styles.radio_button_input}
                      checked={isDoneOption === "Done"}
                      onChange={(e) => setIsDoneOption(e.target.value)}
                    />
                    <label htmlFor="done" className={styles.radio_button_label}>
                      <span className={`${styles.radio_button_custom} ${styles.radio_button_custom_yes}`}></span>
                    </label>
                  </div>
                    
                  <div className={styles.radio_button}>
                    <input
                      type="radio"
                      id="notDone"
                      name="isDone"
                      value="Not Done"
                      className={styles.radio_button_input}
                      checked={isDoneOption === "Not Done"}
                      onChange={(e) => setIsDoneOption(e.target.value)}
                    />
                    <label htmlFor="notDone" className={styles.radio_button_label}>
                      <span className={`${styles.radio_button_custom} ${styles.radio_button_custom_no}`}></span>
                    </label>
                    </div>
                  </div>
                </div>

                <div className={styles.edit_field_container}>
                  <span>Set the distance:</span>
                  <button className={styles.distance_button}
                        type="button"
                        onClick={() => handleDistanceChange(String(Math.max(0, Number(distanceOption) - 1)))} // Ensure it doesn't go below 0
                      >
                        &lt;
                      </button>
                  <input className={styles.distance_option_field} type="number" 
                  value={distanceOption}
                  onChange={(e) => handleDistanceChange(e.target.value)}/>
                    <button className={styles.distance_button}
                        type="button"
                        onClick={() => handleDistanceChange(String(Number(distanceOption) + 1))}
                      >
                        &gt;
                      </button>
                </div>
                
                <div>

                  <div className={styles.edit_field_container}>
                    <span>Set the date:</span>
                  <DatePickerComponent
                  setOutSideValue={setDateOption}
                  initialValue={parseDateStringForCalendar(run.date)}
                  />
                  </div>

                </div>
              </div>
            )
          ))}
        <div className={styles.modal_buttons_container}>
        <button className={styles.bottom_modal_button} 
         onClick={() => setEditModeIsOpen(false)}>Cancel</button>
        <button className={styles.bottom_modal_button}
         onClick={(e) => handleEditSubmit(e)}>Submit</button>
        </div>
      </div>
    )}
  </Modal>
  )
}
