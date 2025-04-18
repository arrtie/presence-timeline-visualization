/** @format */

import type { RawPresenceData } from "@src/model";

const presenceRoute = "/api/presence";

export async function getPresence() {
  try {
    const response = await fetch(presenceRoute);
    if (!response.ok) {
      console.error(
        `fetch ${presenceRoute} returned status: ${response.status}`
      );
      return null;
    }
    const jsonData = await response.json();
    return jsonData as RawPresenceData;
  } catch (err) {
    console.error(err);
    return null;
  }
}
