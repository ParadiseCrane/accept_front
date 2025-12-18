import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function ToggleAttemptsAIGenerated(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/attempt/toggle-ai/${req.query.spec}`,
    method: "GET",
  });
}
