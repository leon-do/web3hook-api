import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { RelayerTransaction } from "defender-relay-client";
import { DefenderRelaySigner, DefenderRelayProvider } from "defender-relay-client/lib/ethers";
import isAuthorized from "@/utils/isAuthorized";

type ErrorResponse = {
  error: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RelayerTransaction | ErrorResponse>) {
  try {
    console.log("/openzepplin/writeFunction");
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ error: "Invalid License Key" });
    const { apiKey, apiSecret, abi, address, func, args, amount } = req.body;
    const provider = new DefenderRelayProvider({ apiKey, apiSecret });
    const signer = new DefenderRelaySigner({ apiKey, apiSecret }, provider, { speed: "fast" });
    const contract = new ethers.Contract(address, abi, signer);
    // AI dark wizardry converts `cat, dog, [1,2,3]` to `["cat", "dog", [1,2,3]]`
    const arg = args ? args.split(/,(?![^\[]*\])/).map((_arg: string) => (_arg.trim().startsWith("[") && _arg.trim().endsWith("]") ? JSON.parse(_arg.trim()) : _arg.trim())) : [];
    const response: RelayerTransaction = await contract[func](...arg, {
      value: amount === "" ? amount : 0,
    });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Send Transaction Error" });
  }
}
