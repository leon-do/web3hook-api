import type { NextApiRequest, NextApiResponse } from "next";
import isAuthorized from "@/utils/isAuthorized";
import { ethers } from "ethers";

type Data = {
  id: string
  parameter: string;
}[];

// https://docs.moralis.io/streams-api/evm/how-to-listen-to-all-erc20-contract-transfers-over-certain-amount-sent-by-specific-address#programmatically
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/zapier/getEventParameters");
    const {license_key, event, abi} = req.body;
    if (!(await isAuthorized(license_key))) return res.status(400).send([]);
    const iface = new ethers.utils.Interface(abi);
    console.log(iface.events[event])
    const parameters: Data = iface.events[event].inputs.map((input) => ({ id: `${iface.events[event].name}(${input.type} ${input.name})`, parameter: input.name }));
    return res.status(200).json(parameters);
  } catch (error) {
    console.error(error);
    res.status(400).json([]);
  }
}
