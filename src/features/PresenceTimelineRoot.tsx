/** @format */

import { useEffect, useMemo, useState } from "react";
import PresenceTimelineController from "./PresenceTimelineController";
import { getPresence } from "@src/api/presence";
import { getProfiles } from "@src/api/profiles";
import type { Profile, RawDataStatus, RawPresenceData } from "@src/model";

export default function PresenceTimelineRoot() {
  const [presenceStatus, setPresenceStatus] = useState<RawDataStatus>("loading");
  const [profileStatus, setProfileStatus] = useState<RawDataStatus>("loading");
  const [presenceData, setPresenceData] = useState<RawPresenceData | null>(
    null
  );
  const [profiles, setProfiles] = useState<Profile[] | null>(null);

  useEffect(() => {
    getPresence()
      .then((jsonData) => {
        if (jsonData == null) {
          setPresenceStatus("empty");
        } else {
          setPresenceStatus("success");
          setPresenceData(jsonData);
        }
      })
      .catch((err) => {
        console.error(err);
        setPresenceStatus("empty");
      });
  }, []);

  useEffect(() => {
    getProfiles()
      .then((jsonData) => {
        if (jsonData == null) {
          setProfileStatus("empty");
        } else {
          setProfileStatus("success");
          setProfiles(jsonData);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const dataStatus = useMemo<RawDataStatus>(() => {
    if(presenceStatus === "empty" || profileStatus === "empty") {
      return "empty";
    }
    if(presenceStatus === "success" && profileStatus === "success") {
      return "success";
    }
    return "loading";
  }, [presenceStatus, profileStatus])

  return (
    <>
      <PresenceTimelineController
        dataStatus={dataStatus}
        presenceData={presenceData}
        profiles={profiles}
      />
    </>
  );
}
