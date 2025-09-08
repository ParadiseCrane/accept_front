import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function SentAIHintFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/helpful`,
    method: "POST",
  });
}
