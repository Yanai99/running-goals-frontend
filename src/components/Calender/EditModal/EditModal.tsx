import React from 'react'
import { Run } from '../../../model';
import styles from './EditModal.module.less'
import Modal from 'react-modal';

interface EditModalProps {
  editModeIsOpen: any;
  setEditModeIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: Date | null;
  exercises:Run[]
  isDoneOption:string;
  setIsDoneOption:React.Dispatch<React.SetStateAction<string>>;
  handleEditSubmit:(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
}

export const EditModal: React.FC<EditModalProps> = (
  {editModeIsOpen,setEditModeIsOpen,setModalIsOpen,selectedDate,exercises,isDoneOption,setIsDoneOption, handleEditSubmit}) => {
  return (
    <Modal // Modal for editing
    isOpen={editModeIsOpen}
    onRequestClose={() => {setEditModeIsOpen(false); setModalIsOpen(false)}}
    contentLabel="edit mode"
    style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#f0f0f0',  // Example custom background color
          padding: '20px',  // Example custom padding
          borderRadius: '8px'  // Example custom border radius
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'  // Example custom overlay color
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
                <input type="date" 
                />
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
  )
}
