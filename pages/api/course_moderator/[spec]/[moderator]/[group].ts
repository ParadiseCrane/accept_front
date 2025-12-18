import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function AddCourseModerator(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/course_moderator/${req.query.spec}/${req.query.moderator}/${req.query.group}`,
    method: "POST",
  });
}
