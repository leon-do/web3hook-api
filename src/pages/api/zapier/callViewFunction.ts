import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { providers } from "@/utils/providers";
import isAuthorized from "@/utils/isAuthorized";

type Data = {
  data: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/zapier/callViewFunction");
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ data: "Invalid License Key" });
    const { chainId, address, abi, func, args } = req.body;
    const provider = providers[chainId];
    if (!provider) return res.status(400).send({ data: "Invalid Chain ID" });
    const contract = new ethers.Contract(address, abi, provider);
    // AI dark wizardry converts `cat, dog, [1,2,3]` to `["cat", "dog", [1,2,3]]`
    const arg = args ? args.split(/,(?![^\[]*\])/).map((_arg: string) => (_arg.trim().startsWith("[") && _arg.trim().endsWith("]") ? JSON.parse(_arg.trim()) : _arg.trim())) : [];
    const val = await contract[func](...arg);
    return res.status(200).send({ data: val.toString() });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ data: error.message as string });
  }
}
