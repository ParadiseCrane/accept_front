import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function EditTournamentTag(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: "api/lesson_tag",
    method: "PUT",
  });
}
