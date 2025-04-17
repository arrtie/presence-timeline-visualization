export type RawDataStatus = "loading" | "empty" | "success";

export type PresenceInterval = [number, number];

export type PresenceStatus = "absent" | "present";

export interface RawPresenceDataInstance {
    presence_intervals: PresenceInterval[];
    current_status: PresenceStatus;
};

export interface RawPresenceData {
    [key: number] : RawPresenceDataInstance;
};