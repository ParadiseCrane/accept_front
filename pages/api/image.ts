import { getCookieValue } from "@utils/cookies";
import { getApiUrl } from "@utils/getServerUrl";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fetchUrl = `${getApiUrl()}/api/image`;
  const accessToken = getCookieValue(req.headers.cookie || "", "access_token");

  try {
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": req.headers["content-type"] || "",
      },
      body: req,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
