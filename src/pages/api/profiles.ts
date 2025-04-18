/** @format */

import profilesData from "@fixtures/profiles.json";

export async function GET() {
  return new Response(JSON.stringify(profilesData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
