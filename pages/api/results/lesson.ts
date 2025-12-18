import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function AssignmentTaskResults(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO mocked method
  await fetchWrapper({
    req: req,
    res: res,
    url: "api/results/lesson",
    method: "POST",
  });
}
