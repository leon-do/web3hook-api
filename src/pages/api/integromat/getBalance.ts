import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import isAuthorized from "@/utils/isAuthorized";
import { providers } from "@/utils/providers";

type Data = {
  balanceWei: string;
  balance: string;
};

type Error = {
  data: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
  try {
    console.log("/integromat/getBalance");
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ data: "Invalid License Key" });
    const { chainId, address } = req.body;
    const provider = providers[chainId];
    if (!provider) return res.status(400).send({ data: "Invalid Chain ID" });
    const balanceWei = await provider.getBalance(address);
    const balance = ethers.utils.formatEther(balanceWei);
    return res.status(200).send({ balanceWei: balanceWei.toString(), balance });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ data: error.message as string });
  }
}
