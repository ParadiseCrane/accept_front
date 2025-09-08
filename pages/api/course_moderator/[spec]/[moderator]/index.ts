import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function DeleteCourseModerator(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/course_moderator/${req.query.spec}?moderator=${req.query.moderator}`,
    method: "DELETE",
  });
}
