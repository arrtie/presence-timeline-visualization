/** @format */

import { styled } from "styled-components";
import EmptyPresenceData from "./EmptyPresenceData";
import Loader from "./Loader";
import TimelineVisualization from "./TimelineVisualization";
import type { RawDataStatus, RawPresenceData } from "@src/model";
import { PresenceManager } from "./PresenceManager";
import { useEffect, useMemo, useRef, useState } from "react";
import DateSelect from "./DateSelect";

const Container = styled.section`
  width: 100%;
  height: 100%;
  background: slateblue;
`;
interface PresenceTimelineProps {
  dataStatus: RawDataStatus;
  data: null | RawPresenceData;
}
export default function PresenceTimelineController({
  dataStatus,
  data,
}: PresenceTimelineProps) {
  const presence = useMemo(() => {
    if (data == null) {
      return null;
    }
    const presenceManager = new PresenceManager(data);
    const dateOptions = presenceManager.getAllPresenceDates();
    const activeDate = dateOptions.at(0);
    if (activeDate == null) {
      return null;
    }
    return { manager: presenceManager, dateOptions, activeDate };
  }, [data]);

  const [selectedDate, setSelectedDate] = useState<string | undefined>()
  
  useEffect(() => {
        setSelectedDate(presence?.activeDate)
  }, [presence?.activeDate]);

  const activePresenceData = useMemo(() => {
    if(presence?.manager == null || selectedDate == null) {
        return null;
    }
    return presence.manager.getPresenceByDate(selectedDate) ?? null
  }, [presence, selectedDate])

  return (
    <Container>
      {(() => {
        if (dataStatus === "loading") {
          return <Loader />;
        }
        if (dataStatus === "empty" || presence?.dateOptions == null || selectedDate == null || activePresenceData == null) {
          return <EmptyPresenceData />;
        }
          return (
            <>
                <DateSelect
                  dateOptions={presence.dateOptions}
                  activeDate={selectedDate}
                  onChange={setSelectedDate}
                />
              <header>Avatars Here</header>
              <TimelineVisualization data={activePresenceData} />
            </>
          ) 
      })()}
    </Container>
  );
}
