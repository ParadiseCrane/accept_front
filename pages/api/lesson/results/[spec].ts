import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function LessonResults(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO mocked method
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/lesson-results/${req.query.spec}`,
    method: "POST",
  });
}
