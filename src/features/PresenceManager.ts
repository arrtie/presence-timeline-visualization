/** @format */

import type { PresenceInterval, RawPresenceData } from "@src/model";

// Format a number into an ISO string to get just YYYY-MM-DD format
function formatDateForKey(timestamp: number) {
  return new Date(timestamp).toISOString().substring(0, 10);
}

export class PresenceManager {
  dayToPresenceMap = new Map<string, ProfilePresenceInterval[]>();

  constructor(presenceData: RawPresenceData) {
    // for every uid in the RawPresenceData object
    for (const [uuid, presenceAndStatus] of Object.entries(presenceData)) {
      // iterate over every presence interval
      presenceAndStatus.presence_intervals.forEach(
        (presenceInterval: PresenceInterval) => {
          const presIntervalInstance = new ProfilePresenceInterval(
            uuid,
            presenceInterval
          );
          const enterDate = presIntervalInstance.enterDate;
          const sameDayIntervals = this.dayToPresenceMap.get(enterDate) ?? [];
          // add the interval to the the day when it started.
          this.dayToPresenceMap.set(enterDate, [
            ...sameDayIntervals,
            presIntervalInstance,
          ]);
        }
      );
    }
  }
  // get all the presence intervals for a DateString
  getPresenceByDate(dateString: string) {
    return this.dayToPresenceMap.get(dateString);
  }
  // return the earliest and latest timestamps within an array of profile presence intervals
  getEarliestAndLatestTimestamp(
    profilePresenceIntervals: ProfilePresenceInterval[]
  ) {
    let earliestTimestamp = Infinity;
    let latestTimestamp = -Infinity;

    profilePresenceIntervals.forEach((presenceInstance) => {
      const enterTime = presenceInstance.enterTime;
      const exitTime = presenceInstance.exitTime;
      earliestTimestamp = Math.min(earliestTimestamp, enterTime);
      latestTimestamp = Math.max(latestTimestamp, exitTime);
    });

    return [earliestTimestamp, latestTimestamp];
  }
  // create a Map of profile uids to profile presence intervals
  mapProfilePresenceIntervalsByUuid(
    profilePresenceIntervals: ProfilePresenceInterval[]
  ) {
    const uuidToIntervalMap = new Map();
    profilePresenceIntervals.forEach((profilePresenceInterval) => {
      const { uuid } = profilePresenceInterval;
      const sameUuidIntervals = uuidToIntervalMap.get(uuid) ?? [];
      uuidToIntervalMap.set(uuid, [
        ...sameUuidIntervals,
        profilePresenceInterval,
      ]);
    });
    return uuidToIntervalMap;
  }

  // return the DateStrings for each day with presence intervals
  getAllPresenceDates() {
    return Array.from(this.dayToPresenceMap.keys()).sort();
  }
}

// A class that represents an instance of a profile's presence
export class ProfilePresenceInterval {
  uuid: string;
  enterTime: number;
  exitTime: number;
  enterDate: string;
  exitDate: string;

  constructor(uuid: string, [enterTime, exitTime]: PresenceInterval) {
    this.uuid = uuid;
    this.enterTime = enterTime;
    this.exitTime = exitTime;
    this.enterDate = formatDateForKey(enterTime);
    this.exitDate = formatDateForKey(exitTime);
  }
}
