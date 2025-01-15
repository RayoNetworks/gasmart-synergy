// File: components/ui/date-picker.tsx

import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <ReactDatePicker
      selected={value}
      onChange={onChange}
      dateFormat="yyyy-MM-dd"
      className="border border-gray-300 rounded-md p-2"
    />
  );
};
