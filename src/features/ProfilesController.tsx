/** @format */

import type { Profile } from "@src/model";
import { useMemo } from "react";
import ProfileAvatar from "./ProfileAvatar";
import { styled } from "styled-components";

const ProfileAvatarsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 4px;
`;

export default function ProfilesController({
  profiles,
  presentProfileUuids,
}: {
  profiles: Profile[];
  presentProfileUuids: string[];
}) {
  const profileMap = useMemo(() => {
    const mapOfProfiles: Record<string, Profile> = {};
    profiles.forEach((profile) => {
      mapOfProfiles[profile.uid] = profile;
    });
    return mapOfProfiles;
  }, [profiles]);

  const presentProfiles = useMemo(() => {
    return presentProfileUuids
      .map((uid) => profileMap[uid])
      .filter((profile) => profile != null);
  }, [profileMap, profiles, presentProfileUuids]);

  return (
    <ProfileAvatarsContainer>
      {presentProfiles.map((profile) => {
        return <ProfileAvatar key={profile.uid} profile={profile} />;
      })}
    </ProfileAvatarsContainer>
  );
}
