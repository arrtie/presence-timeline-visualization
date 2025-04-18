/** @format */

import { styled } from "styled-components";
import EmptyPresenceData from "@components/EmptyPresenceData";
import Loader from "@components/Loader";
import TimelineView from "@features/timeline/TimelineView";
import type { Profile, RawDataStatus, RawPresenceData } from "@src/model";
import { PresenceManager } from "./PresenceManager";
import { useEffect, useMemo, useState } from "react";
import DateSelect from "@components/DateSelect";
import ProfilesController from "./ProfilesController";

const Container = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

interface PresenceTimelineProps {
  dataStatus: RawDataStatus;
  presenceData: null | RawPresenceData;
  profiles: null | Profile[];
}

export default function PresenceTimelineController({
  dataStatus,
  presenceData,
  profiles,
}: PresenceTimelineProps) {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const presence = useMemo(() => {
    if (presenceData == null) {
      return null;
    }
    const presenceManager = new PresenceManager(presenceData);
    const dateOptions = presenceManager.getAllPresenceDates();
    const activeDate = dateOptions.at(0);
    if (activeDate == null) {
      return null;
    }
    return { manager: presenceManager, dateOptions, activeDate };
  }, [presenceData]);

  useEffect(() => {
    setSelectedDate(presence?.activeDate);
  }, [presence?.activeDate]);

  const { activePresenceData, startTimestamp, endTimestamp, presentProfiles } =
    useMemo(() => {
      if (presence?.manager == null || selectedDate == null) {
        return {};
      }
      const activePresenceData =
        presence.manager.getPresenceByDate(selectedDate);

      if (activePresenceData == null) {
        return {};
      }

      const uuidMap =
        presence.manager.mapProfilePresenceIntervalsByUuid(activePresenceData);
      const presentProfiles = Array.from(uuidMap.keys()) as string[];
      const [startTimestamp, endTimestamp] =
        presence.manager.getEarliestAndLatestTimestamp(activePresenceData);

      return {
        activePresenceData: uuidMap,
        startTimestamp,
        endTimestamp,
        presentProfiles,
      };
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
            <ProfilesController
              profiles={profiles ?? []}
              presentProfileUuids={presentProfiles}
            />
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
