/** @format */

import type { ProfilePresenceInterval } from "@features/PresenceManager";
import { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import TimelineColumn from "./TimelineColumn";
import { HorizontalLines } from "./HorizontalLines";

// TODO: import these values from a common resource
const timelineColumnWidth = 60;
const timelinePadding = 50;

interface Dimensions {
  width: number;
  height: number;
}

const Viz = styled.svg`
  flex-grow: 1;
  background: white;
`;

interface TimelineVisualizationProps {
  profilePresenceMap: Map<string, ProfilePresenceInterval[]>;
  startTimestamp: number;
  endTimestamp: number;
}

// TODO: replace timestamp props with the difference between them
export default function TimelineVisualization({
  profilePresenceMap,
  startTimestamp,
  endTimestamp,
}: TimelineVisualizationProps) {
   
  const vizRef = useRef<SVGSVGElement>(null);

  // we generate a horizontal bar for each hour within our timespan
  const horizontalRowCount = useMemo(() => {
    return Math.round((endTimestamp - startTimestamp) / (1000 * 60 * 60));
  }, [startTimestamp, endTimestamp]);

  // TODO: Move to a hook
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = (): void => {
      if (vizRef.current) {
        const { width, height } = vizRef.current.getBoundingClientRect();
        setDimensions({
          width: width - 2 * timelinePadding,
          height: height - 2 * timelinePadding,
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

  // function to convert a timestamp into Y coordinates
  const convertY = useMemo<(timestamp: number) => number>(
    () => (timestamp: number) => {
      const duration = endTimestamp - startTimestamp;
      const diffFromStart = timestamp - startTimestamp;
      const timeToHeightRatio = diffFromStart / duration;
      return dimensions.height * timeToHeightRatio + timelinePadding;
    },
    [dimensions, startTimestamp, endTimestamp]
  );

  return (
    <Viz ref={vizRef}>
      {dimensions == null ? null : (
        <>
          <HorizontalLines count={horizontalRowCount} />
          {/* iterate over each Profile's presence values to create that profile's column of figures   */}
          {Array.from(profilePresenceMap.entries()).map(
            ([uuid, data], index) => {
              return (
                <TimelineColumn
                  key={uuid}
                  // the X position of the columns content is the column width * the column index
                  //  plus half the column width to center the elements
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
