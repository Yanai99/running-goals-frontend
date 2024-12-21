import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePickerComponent.module.less';
//import {parseDateStrin} from '../../WeekFunctions'

interface DatePickerComponentProps {
  initialValue: Date | null;
  setOutSideValue:React.Dispatch<React.SetStateAction<any>>;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({initialValue,setOutSideValue }:DatePickerComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialValue);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setOutSideValue(date);
  };

  return (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        customInput={<CustomInput />}
      />
    </div>
  );
};

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, onClick }) => (
  <button className={styles.custom_input} onClick={onClick}>
    {value}
  </button>
);

export default DatePickerComponent;
