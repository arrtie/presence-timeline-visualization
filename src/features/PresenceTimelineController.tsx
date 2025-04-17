/** @format */

import { styled } from "styled-components";
import EmptyPresenceData from "../components/EmptyPresenceData";
import Loader from "@components/Loader";
import TimelineView from "@features/timeline/TimelineView";
import type { RawDataStatus, RawPresenceData } from "@src/model";
import { PresenceManager } from "./PresenceManager";
import { useEffect, useMemo, useState } from "react";
import DateSelect from "../components/DateSelect";

const Container = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
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

  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  useEffect(() => {
    setSelectedDate(presence?.activeDate);
  }, [presence?.activeDate]);

  const { activePresenceData, startTimestamp, endTimestamp } = useMemo(() => {
    if (presence?.manager == null || selectedDate == null) {
      return {
        activePresenceData: undefined,
        startTimestamp: undefined,
        endTimestamp: undefined,
      };
    }
    const activePresenceData = presence.manager.getPresenceByDate(selectedDate);

    if (activePresenceData == null) {
      return {
        activePresenceData: undefined,
        startTimestamp: undefined,
        endTimestamp: undefined,
      };
    }
    const uuidMap =
      presence.manager.mapProfilePresenceIntervalsByUuid(activePresenceData);
    const [startTimestamp, endTimestamp] =
      presence.manager.getEarliestAndLatestTimestamp(activePresenceData);
    return { activePresenceData: uuidMap, startTimestamp, endTimestamp };
  }, [presence, selectedDate]);

  return (
    <Container>
      {(() => {
        if (dataStatus === "loading") {
          return <Loader />;
        }
        if (
          dataStatus === "empty" ||
          presence?.dateOptions == null ||
          selectedDate == null ||
          activePresenceData == null
        ) {
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
            <TimelineView
              profilePresenceMap={activePresenceData}
              startTimestamp={startTimestamp}
              endTimestamp={endTimestamp}
            />
          </>
        );
      })()}
    </Container>
  );
}
