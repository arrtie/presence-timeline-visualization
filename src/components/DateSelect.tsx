/** @format */

import { styled } from "styled-components";

const DateSelectContainer = styled.div`
  display: flex;
  gap: 8px;
`;

interface DateSelectProps {
  dateOptions: string[];
  activeDate: string;
  onChange: (value: string) => void;
}

export default function DateSelect({
  dateOptions,
  activeDate,
  onChange,
}: DateSelectProps) {
  return (
    <DateSelectContainer>
      <p>Select a Date</p>
      <select
        value={activeDate}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {dateOptions.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </DateSelectContainer>
  );
}
