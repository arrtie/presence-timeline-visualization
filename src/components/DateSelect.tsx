/** @format */

// TODO: replace state update with a form submission

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

/**
 * A component that renders a date selection dropdown
 * @param {Object} props - The component props
 * @param {string[]} props.dateOptions - Array of date strings to populate the dropdown
 * @param {string} props.activeDate - Currently selected date value
 * @param {function} props.onChange - Callback function triggered when selection changes
 * @returns {JSX.Element} A date select dropdown with label
 */
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
