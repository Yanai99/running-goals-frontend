import React, {useState} from 'react';
import './App.css';
import UpcomingExercises from './components/UpcomingExercises/UpcomingExercises';
import { Exercise,exercisesMock } from './model';
import  isDateInCurrentWeek  from './WeekFunctions'
import NewGoal from './components/NewGoal/NewGoal';



const App: React.FC = () => {

  const [exrecises, setExrecises] = useState<Exercise[]>([]);

  const handleUpcoming = (exercises: Exercise[]): Exercise[] => {
    return exercises.filter(exercise => isDateInCurrentWeek(exercise.date));
  };
  console.log(exrecises.length)
  if(exrecises.length === 0){
    return (
      <div className="App">
        <NewGoal/>
      </div>);
  }
  else{
    return (
      <div className="App">
          {<UpcomingExercises exrecises={handleUpcoming(exrecises)}/>}
      </div>
    );
  }
}

export default App;
