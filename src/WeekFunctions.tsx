// Converts string of date to corresponding date
const parseDateString = (dateStr: string): Date => {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};
  
// Converts Date to string
const formatDateToString = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
};

const parseDateStringForCalendar = (dateStr: string): Date | null => {
    // Regular expression to match the date format MM/DD/YYYY
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  
    if (!datePattern.test(dateStr)) {
      return null;
    }
  
    const [month, day, year] = dateStr.split('/').map(Number);
  
    // Check if the date is valid
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      return date;
    }
  
    return null;
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
  
  
const isDateInCurrentWeek = (dateStr: string ): boolean => {
    const today = new Date();
    const { start, end } = getWeekStartAndEnd(today);
  
    const dateToCheck = parseDateString(dateStr);
    return dateToCheck >= start && dateToCheck <= end;
};

export {isDateInCurrentWeek , parseDateString, parseDateStringForCalendar,formatDateToString};

  // replace all that's here with day.js ?