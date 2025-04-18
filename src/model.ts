/** @format */

export type RawDataStatus = "loading" | "empty" | "success";

export type PresenceInterval = [number, number];

export type PresenceStatus = "absent" | "present";

export interface RawPresenceDataInstance {
  presence_intervals: PresenceInterval[];
  current_status: PresenceStatus;
}

export interface RawPresenceData {
  [key: number]: RawPresenceDataInstance;
}

export interface Profile {
  uid: string;
  created_at: number;
  name: string;
  photo_url: null | string;
  category: null | "visitor" | "family";
}
