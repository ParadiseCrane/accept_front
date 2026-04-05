import { fetchWrapper } from "@utils/fetchWrapper";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetchWrapper({
    req,
    res,
    url: `api/task/rights/${req.query.spec}`,
    method: "GET",
  });
}
