export type DataStatus = "loading" | "empty" | "complete";

export type PresenceInterval = [number, number];

export type PresenceStatus = "absent" | "present";

export interface PresenceDataInstance {
    presence_intervals: PresenceInterval[];
    current_status: PresenceStatus;
};

export interface PresenceData {
    [key: number] : PresenceDataInstance;
};