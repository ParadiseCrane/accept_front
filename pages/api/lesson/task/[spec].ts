import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function AddLessonTask(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/lesson/task/${req.query.spec}`,
    method: "POST",
  });
}
