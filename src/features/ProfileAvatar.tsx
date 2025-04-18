/** @format */

import type { Profile } from "@src/model";
import { styled } from "styled-components";

// TODO: move constants to common palette
const avatarWidth = 50;
const avatarBorderColor = "#2e86de";
const initialBackgroundColor = "slateblue";

const Avatar = styled.div`
  width: ${avatarWidth}px;
  height: ${avatarWidth}px;
  border-radius: 50%;
  border: 3px solid ${avatarBorderColor};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: circle(60%);
`;

const AvatarContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${initialBackgroundColor};
  color: white;
  font-size: 24px;
  font-weight: bold;
  overflow: hidden;
  clip-path: circle(45%);
`;

/**
 * A component that displays a user's avatar image or their initial letter
 * in a circular frame if no image is available
 * 
 * @remarks
 * The avatar will:
 * - Show the profile photo if photo_url exists
 * - Display the first letter of the user's name on a colored background if no photo
 * - Maintain a consistent circular shape with a border
 * - Include proper ARIA labels for accessibility
 * 
 * @param {Object} props - Component props
 * @param {Profile} props.profile - User profile containing name and optional photo URL
 * @returns {JSX.Element} A circular avatar component
 */
export default function ProfileAvatar({ profile }: { profile: Profile }) {
  return profile.photo_url == null ? (
    <Avatar aria-label={profile.name}>
      <AvatarContent>{profile.name.substring(0, 1)}</AvatarContent>
    </Avatar>
  ) : (
    <Avatar>
      <AvatarContent>
        <AvatarImage alt={profile.name} src={profile.photo_url} />
      </AvatarContent>
    </Avatar>
  );
}
