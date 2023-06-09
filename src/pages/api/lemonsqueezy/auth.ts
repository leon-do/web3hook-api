import type { NextApiRequest, NextApiResponse } from "next";
import isAuthorized from "@/utils/isAuthorized";

type Data = {
  success: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/lemonsqueezy/auth");
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ success: false });
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ success: false });
  }
}
