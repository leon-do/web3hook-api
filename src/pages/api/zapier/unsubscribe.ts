import type { NextApiRequest, NextApiResponse } from "next";
import isAuthorized from "@/utils/isAuthorized";
import prismaDelete from "@/prisma/delete";

type Data = {
  success: boolean;
};

// https://platform.zapier.com/docs/triggers#unsubscribe
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/zapier/unsubscribe");
    if (!req.body.webhookUrl) return res.status(400).send({ success: false });
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ success: false });
    const success = await prismaDelete(req.body.webhookUrl);
    res.status(200).send({ success });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ success: false });
  }
}
