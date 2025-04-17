/** @format */

import type { ProfilePresenceInterval } from "@features/PresenceManager";
import { styled } from "styled-components";
const fillColor = "#0768d1";
const borderColor = "#84c3fb";
const connectorStrokeColor = "#4d9dea";

const Circle = styled.circle`
  stroke: ${borderColor};
  stroke-width: 2px;
  fill: ${fillColor};
`;

const Line = styled.line`
  stroke: ${connectorStrokeColor};
  stroke-width: 4px;
`;

interface TimelineColumnProps {
  intervals: ProfilePresenceInterval[];
  x: number;
  convertY: (y: number) => number;
}

export default function TimelineColumn({
  intervals,
  x,
  convertY,
}: TimelineColumnProps) {
  const radius = 5;
  return intervals.map((interval) => {
    const enterTimestamp = interval.enterTime;
    const exitTimestamp = interval.exitTime;
    const enterBubbleY = convertY(enterTimestamp);
    const exitBubbleY = convertY(exitTimestamp);
    return (
      <g key={enterTimestamp}>
        <Line
          x1={x}
          x2={x}
          y1={enterBubbleY + radius}
          y2={exitBubbleY - radius}
        />
        <Circle
          r={radius}
          cx={x}
          cy={enterBubbleY}
          aria-label={enterTimestamp.toString()}
          tabIndex={0}
        />
        <Circle
          r={radius}
          cx={x}
          cy={exitBubbleY}
          aria-label={exitTimestamp.toString()}
          tabIndex={0}
        />
      </g>
    );
  });
}
