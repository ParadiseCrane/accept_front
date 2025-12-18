import { fetchWrapper } from "@utils/fetchWrapper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function AssignmentSchemaAIGeneratedCount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await fetchWrapper({
    req: req,
    res: res,
    url: `api/attempt/assignment/ai/count/${req.query.spec}`,
    method: "POST",
  });
}
