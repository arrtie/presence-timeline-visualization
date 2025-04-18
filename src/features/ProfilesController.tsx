/** @format */

import type { Profile } from "@src/model";
import { useMemo } from "react";
import ProfileAvatar from "./ProfileAvatar";
import { styled } from "styled-components";

// TODO: use constants from palette
const ProfileAvatarsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 4px;
`;

interface ProfilesControllerProps {
  profiles: Profile[];
  presentProfileUuids: string[];
}

/**
 * Controller component that manages and displays profile avatars for users present in the timeline
 * 
 * @remarks
 * This component:
 * - Creates a map of profiles for efficient lookup by UUID
 * - Filters and displays avatars only for profiles that are present in the timeline
 * - Arranges avatars in a horizontal flex container
 * 
 * @param {Object} props - Component props
 * @param {Profile[]} props.profiles - Array of all available user profiles
 * @param {string[]} props.presentProfileUuids - Array of UUIDs for profiles that are present
 * @returns {JSX.Element} A container with filtered profile avatars
 */
export default function ProfilesController({
  profiles,
  presentProfileUuids,
}: ProfilesControllerProps) {
  const profileMap = useMemo(() => {
    const mapOfProfiles: Record<string, Profile> = {};
    profiles.forEach((profile) => {
      mapOfProfiles[profile.uid] = profile;
    });
    return mapOfProfiles;
  }, [profiles]);

  const presentProfiles = useMemo(() => {
    // TODO: how should we handle when profile data is missing but the presence intervals are not?
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
