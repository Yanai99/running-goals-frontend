export interface Run{
    id:string;
    distance:string;
    date:string;
    status:string;
    pace:string;
    isDone:boolean;
    isGoal:boolean;
}

export interface userSettings{
    dateFormat:string;
    distanceUnit:string;
}


// adding "status:string" and "pace:string" for future features
/* export const exercisesMock: Exercise[] = [
    { id: "1", distance: "5", date: '26/05/2024', isDone: false },
    { id: 2, distance: 10, date: '27/05/2024', isDone: true },
    { id: 3, distance: 15, date: '28/05/2024', isDone: false },
    { id: 4, distance: 20, date: '29/05/2024', isDone: true },
    { id: 5, distance: 25, date: '30/05/2024', isDone: false },
    { id: 6, distance: 30, date: '31/05/2024', isDone: true },
    { id: 7, distance: 35, date: '01/06/2024', isDone: false },
    { id: 8, distance: 40, date: '02/06/2024', isDone: true },
    { id: 9, distance: 45, date: '03/06/2024', isDone: false },
    { id: 10, distance: 50, date: '13/06/2024', isDone: true },
  ]; */