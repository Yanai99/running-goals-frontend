declare module 'react-datepicker' {
    import * as React from 'react';
    
    interface ReactDatePickerProps {
      selected: Date | null ;
      onChange: (date: Date | null) => void;
      dateFormat?: string;
      customInput?: React.ReactNode;
      // other props you might need
    }
  
    class ReactDatePicker extends React.Component<ReactDatePickerProps, any> {}
  
    export default ReactDatePicker;
  }
  