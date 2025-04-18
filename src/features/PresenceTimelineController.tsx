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

/**
 * Main controller component for the presence timeline visualization
 * Manages the state and data flow for displaying presence data across different dates
 * 
 * @param {Object} props - The component props
 * @param {RawDataStatus} props.dataStatus - Current status of data loading ('loading' | 'empty' | 'ready')
 * @param {RawPresenceData | null} props.presenceData - Raw presence data containing user timestamps
 * @param {Profile[] | null} props.profiles - Array of user profile data
 * @returns {JSX.Element} A container with date selection, profile filtering, and timeline visualization
 */
export default function PresenceTimelineController({
  dataStatus,
  presenceData,
  profiles,
}: PresenceTimelineProps) {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  
  // create the presence manager from the raw presence data
  // create the dateOptions from the presence intervals
  // set the activeDate to the first available date
  // memoized to avoid unnecessary re-processing
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

  // if the presence data's activeDate changes, set the selected date
  useEffect(() => {
    setSelectedDate(presence?.activeDate);
  }, [presence?.activeDate]);

  // Create active presence data from the selected date
  // create the start and end timestamps for the selected date
  // create an array of profiles that are present on the selected date
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
    
  // TODO: move the loading and error states up a level
  // TODO: move the components to a common parent
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
