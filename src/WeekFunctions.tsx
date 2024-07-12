const parseDateString = (dateStr: string): Date => {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const getWeekStartAndEnd = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);
    
    const day = date.getDay();
    const diffToSunday = -day; // Adjust if the current day is not Sunday
  
    start.setDate(date.getDate() + diffToSunday);
    start.setHours(0, 0, 0, 0); // Set to the start of the day
  
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999); // Set to the end of the day
    return { start, end };
  };
  
  
  const isDateInCurrentWeek = (dateStr: string): boolean => {
    const today = new Date();
    const { start, end } = getWeekStartAndEnd(today);
  
    const dateToCheck = parseDateString(dateStr);
    return dateToCheck >= start && dateToCheck <= end;
  };

  export default isDateInCurrentWeek;

  // replace all that's here with day.js