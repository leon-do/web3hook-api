import type { NextApiRequest, NextApiResponse } from "next";
import isAuthorized from "@/utils/isAuthorized";
import prismaCreate from "@/prisma/create";

type Data = {
  success: boolean;
};

// https://platform.zapier.com/docs/triggers#subscribe
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/api/zapier/subscribe");
    if (!req.body.webhookUrl) return res.status(400).send({ success: false });
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ success: false });
    const success = await prismaCreate(req);
    return res.status(200).send({ success });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ success: false });
  }
}
