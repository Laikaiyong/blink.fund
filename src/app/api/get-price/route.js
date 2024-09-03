import axios from "axios";

export const runtime = "edge";

export async function POST(req) {
  try {
    const { ids, vsToken } = await req.json();
    const response = await axios.get("https://price.jup.ag/v6/price", {
      params: { ids, vsToken },
    });
    return Response.json({ data: response.data });
  } catch (error) {
    console.error("Error fetching Jupiter price:", error);
    throw error;
  }
}
