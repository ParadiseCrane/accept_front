import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function TournamentAttemptsAIGenerated(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/attempt/tournament/ai/${req.query.spec}`,
    method: "POST",
  });
}
