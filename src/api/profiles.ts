/** @format */

import type { Profile } from "@src/model";

const profilesRoute = "/api/profiles";

export async function getProfiles() {
  try {
    const response = await fetch(profilesRoute);
    if (!response.ok) {
      console.error(
        `fetch ${profilesRoute} returned status: ${response.status}`
      );
      return null;
    }
    const jsonData = await response.json();
    return jsonData as Profile[];
  } catch (err) {
    console.error(err);
    return null;
  }
}
