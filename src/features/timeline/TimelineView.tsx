/** @format */

import type { ProfilePresenceInterval } from "@features/PresenceManager";
import { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import TimelineColumn from "./TimelineColumn";

export const timelineColumnWidth = 60;

interface Dimensions {
  width: number;
  height: number;
}

const Viz = styled.svg`
  flex-grow: 1;
  background: white;
`;

const horizontalLineStrokeColor = "#f2f4f5";
const HorizontalLine = styled.line`
  stroke: ${horizontalLineStrokeColor};
  stroke-width: 2px;
`;

interface TimelineVisualizationProps {
  profilePresenceMap: Map<string, ProfilePresenceInterval[]>;
  startTimestamp: number;
  endTimestamp: number;
}

function HorizontalLines({ count = 24 }: { count?: number }) {
  return Array(count)
    .fill(null)
    .map((_, index) => {
      const y = `${(100 * index) / count}%`;
      return <HorizontalLine key={y} x1="0" x2="100%" y1={y} y2={y} />;
    });
}

const padding = 50;

export default function TimelineVisualization({
  profilePresenceMap,
  startTimestamp,
  endTimestamp,
}: TimelineVisualizationProps) {
  const vizRef = useRef<SVGSVGElement>(null);

  const count = useMemo(() => {
    return Math.round((endTimestamp - startTimestamp) / (1000 * 60 * 60));
  }, [startTimestamp, endTimestamp]);

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = (): void => {
      if (vizRef.current) {
        const { width, height } = vizRef.current.getBoundingClientRect();
        setDimensions({
          width: width - 2 * padding,
          height: height - 2 * padding,
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Clean up
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const convertY = useMemo<(timestamp: number) => number>(
    () => (timestamp: number) => {
      const duration = endTimestamp - startTimestamp;
      const diffFromStart = timestamp - startTimestamp;
      const timeToHeightRatio = diffFromStart / duration;
      return dimensions.height * timeToHeightRatio + padding;
    },
    [dimensions, startTimestamp, endTimestamp]
  );

  return (
    <Viz ref={vizRef}>
      {dimensions == null ? null : (
        <>
          <HorizontalLines count={count} />
          {Array.from(profilePresenceMap.entries()).map(
            ([uuid, data], index) => {
              return (
                <TimelineColumn
                  key={uuid}
                  x={timelineColumnWidth * index + timelineColumnWidth / 2}
                  convertY={convertY}
                  intervals={data}
                />
              );
            }
          )}
        </>
      )}
      ;
    </Viz>
  );
}
