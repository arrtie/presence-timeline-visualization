/** @format */

import type { ProfilePresenceInterval } from "@features/PresenceManager";
import { styled } from "styled-components";
const fillColor = "#0768d1";
const borderColor = "#84c3fb";
const connectorStrokeColor = "#4d9dea";
const bubbleRadius = 5;

const Bubble = styled.circle`
  stroke: ${borderColor};
  stroke-width: 2px;
  fill: ${fillColor};
`;

const Connector = styled.line`
  stroke: ${connectorStrokeColor};
  stroke-width: 4px;
`;

interface TimelineColumnProps {
  intervals: ProfilePresenceInterval[];
  x: number;
  convertY: (y: number) => number;
}

/**
 * Renders a vertical timeline column showing presence intervals with enter/exit bubbles
 * connected by lines
 * @param {Object} props - The component props
 * @param {ProfilePresenceInterval[]} props.intervals - Array of presence intervals containing enter and exit timestamps
 * @param {number} props.x - X-coordinate position for the column
 * @param {function} props.convertY - Function to convert timestamps to Y-coordinate positions
 * @returns {JSX.Element[]} Array of SVG groups containing connected bubble pairs for each interval
 */
export default function TimelineColumn({
  intervals,
  x,
  convertY,
}: TimelineColumnProps) {

  return intervals.map((interval) => {
    const enterTimestamp = interval.enterTime;
    const exitTimestamp = interval.exitTime;
    const enterBubbleY = convertY(enterTimestamp);
    const exitBubbleY = convertY(exitTimestamp);
    return (
      <g key={enterTimestamp}>
        <Connector
          x1={x}
          x2={x}
          y1={enterBubbleY + bubbleRadius}
          y2={exitBubbleY - bubbleRadius}
        />
        <Bubble
          r={bubbleRadius}
          cx={x}
          cy={enterBubbleY}
          aria-label={enterTimestamp.toString()}
          tabIndex={0}
        />
        <Bubble
          r={bubbleRadius}
          cx={x}
          cy={exitBubbleY}
          aria-label={exitTimestamp.toString()}
          tabIndex={0}
        />
      </g>
    );
  });
}
