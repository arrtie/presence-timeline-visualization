import type { PresenceInterval, RawPresenceData } from "@src/model";

function formatDateForKey(timestamp: number) {
    return new Date(timestamp).toISOString().substring(0, 10);
  }
  
  export class PresenceManager {
    dayToPresenceMap = new Map<string, ProfilePresenceInterval[]>();
    earliestTimestamp = Infinity;
    latestTimestamp = -Infinity;
  
    constructor(presenceData: RawPresenceData) {
      for (const [uuid, presenceAndStatus] of Object.entries(presenceData)) {
        presenceAndStatus.presence_intervals.forEach(
          (presenceInterval: PresenceInterval) => {
            const presIntervalInstance = new ProfilePresenceInterval(
              uuid,
              presenceInterval
            );
            const enterDate = presIntervalInstance.enterDate;
            const sameDayIntervals = this.dayToPresenceMap.get(enterDate) ?? [];
            this.dayToPresenceMap.set(enterDate, [
              ...sameDayIntervals,
              presIntervalInstance,
            ]);
          }
        );
      }
    }
    
    getPresenceByDate(dateString: string){
      return this.dayToPresenceMap.get(dateString);
    }

    getEarliestAndLatestTimestampByDate(dateString: string) {
      const presenceOnDate = this.getPresenceByDate(dateString);
      if (presenceOnDate == null) {
        return null;
      }

      let earliestTimestamp = Infinity;
      let latestTimestamp = -Infinity;
      presenceOnDate.forEach((presenceInstance) => {
        const enterTime = presenceInstance.enterTime;
        const exitTime = presenceInstance.exitTime;
        earliestTimestamp = Math.min(earliestTimestamp, enterTime);
        latestTimestamp = Math.max(latestTimestamp, exitTime);
      });
  
      return [earliestTimestamp, latestTimestamp];
    }
    getAllPresenceDates() {
      return Array.from(this.dayToPresenceMap.keys()).sort();
    }
  
    getAllPresence() {
      return Array.from(this.dayToPresenceMap.entries()).map((entry) => {
        console.log("dayMapEntry: ", entry);
        return entry;
      });
    }
  }
  
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
  
    get sameDay() {
      return this.enterDate === this.exitDate;
    }
  }