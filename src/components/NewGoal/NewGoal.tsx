import React,{useState} from 'react'
import './NewGoal.css'

const NewGoal = () => {
  const [frequency,setFrequency] = useState<string>("default");
  const [distance,setDistance] = useState<number>(0);
  const [startDate,setStartDate] = useState<number>();
  const [endDate,setEndDate] = useState<number>();

  const handleDistanceChange = (distance:string)=>{
    setDistance(parseFloat(distance));
  }

  const handleFrequencyChange = (frequency:string)=>{
    console.log(frequency)
    setFrequency(frequency);
  }

  return (
    <div className='new_goal_div'>
      <h2>New Goal</h2>
    <form className='new_goal_form'>
      <div className='new_goal_input_field'>
    <label>Frequency of runs in a week:</label>
      <select onChange={(e)=>handleFrequencyChange(e.target.value)}>
        <option value="default" selected disabled hidden>Choose here</option>
        <option value="not_at_all">Not at all</option>
        <option value="once">Once top</option>
        <option value="twice">Twice top</option>
        <option value="more_three">Three time or more</option>
      </select>
      </div>
      <div className='new_goal_input_field'>
      <label>Distance:</label>
        <input 
        type="number"
        required 
        value = {distance}
        onChange={(e)=>handleDistanceChange(e.target.value)}
        />
        </div>
        <div className='new_goal_input_field'>
      <label>Date Of Start:</label>
            <input 
            type="date"
            required 
            value={startDate}
            />
        </div>
        <div className='new_goal_input_field'>
          <label>Date Of Goal:</label>
            <input 
            type="date"
            required 
            />
        </div>
        <button>Set Goal!</button>
    </form>
    </div>

  )
}

export default NewGoal