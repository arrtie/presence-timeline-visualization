/** @format */

interface DateSelectProps {
  dateOptions: string[];
  activeDate: string;
  onChange: (value:string) => void;
}

export default function DateSelect({ dateOptions, activeDate, onChange }: DateSelectProps) {
  
  return <select
      value={activeDate}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      {dateOptions.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
}
