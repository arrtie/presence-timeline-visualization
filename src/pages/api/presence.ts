
import presenceData from "@fixtures/presence.json"

export async function GET() {
  return new Response(JSON.stringify(presenceData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
