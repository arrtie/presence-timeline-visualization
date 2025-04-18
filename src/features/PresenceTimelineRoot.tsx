/** @format */

import { useEffect, useState } from "react";
import PresenceTimelineController from "./PresenceTimelineController";
import { getPresence } from "@src/api/presence";
import { getProfiles } from "@src/api/profiles";
import type { Profile, RawDataStatus, RawPresenceData } from "@src/model";

export default function PresenceTimelineRoot() {
  const [dataStatus, setDataStatus] = useState<RawDataStatus>("loading");
  const [presenceData, setPresenceData] = useState<RawPresenceData | null>(
    null
  );
  const [profiles, setProfiles] = useState<Profile[] | null>(null);

  useEffect(() => {
    getPresence()
      .then((jsonData) => {
        if (jsonData == null) {
          setDataStatus("empty");
        } else {
          setDataStatus("success");
          setPresenceData(jsonData);
        }
      })
      .catch((err) => {
        console.error(err);
        setDataStatus("empty");
      });
  }, []);

  useEffect(() => {
    getProfiles()
      .then((jsonData) => {
        if (jsonData != null) {
          setProfiles(jsonData);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
