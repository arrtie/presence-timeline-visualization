import {styled} from "styled-components";


const horizontalLineStrokeColor = "#f2f4f5";
const HorizontalLine = styled.line`
  stroke: ${horizontalLineStrokeColor};
  stroke-width: 2px;
`;

export function HorizontalLines({ count = 24 }: { count?: number; }) {
  return Array(count)
    .fill(null)
    .map((_, index) => {
      const y = `${(100 * index) / count}%`;
      return <HorizontalLine key={y} x1="0" x2="100%" y1={y} y2={y} />;
    });
}
