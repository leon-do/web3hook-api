import type { NextApiRequest, NextApiResponse } from "next";
import { Relayer, RelayerTransaction } from "defender-relay-client";
import isAuthorized from "@/utils/isAuthorized";

type ErrorResponse = {
  error: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RelayerTransaction | ErrorResponse>) {
  try {
    console.log("/openzepplin/sendTransaction");
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ error: "Invalid License Key" });
    const { apiKey, apiSecret, to, amount } = req.body;
    const relayer = new Relayer({ apiKey, apiSecret });
    const response = await relayer.sendTransaction({ to, value: amount, gasLimit: 21000, speed: "fast" });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Send Transaction Error" });
  }
}
