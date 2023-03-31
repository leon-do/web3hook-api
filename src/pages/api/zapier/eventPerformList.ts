import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

type PerformList = {
  transactionHash: string;
  [key: string]: string;
};

// https://platform.zapier.com/docs/faq#i-get-a-trigger-error-saying-that-an-array-is-expected-how-do-i-fix-it
export default async function handler(req: NextApiRequest, res: NextApiResponse<PerformList[]>) {
  try {
    console.log("/zapier/eventPerformList");
    return res.status(200).send([getPerformList(req.body.abi as string, req.body.event as string)]);
  } catch (error) {
    console.error(error);
    return res.status(400).send([]);
  }
}

function getPerformList(_abi: string, _event: string): PerformList {
  const emptyEvents: PerformList = { transactionHash: "0x0" };
  const iface = new ethers.utils.Interface(_abi);
  const eventName = iface.events[_event].name;
  iface.events[_event].inputs.forEach((input) => {
    emptyEvents[`${eventName}_${input.name}`] = "0x0";
  });
  return emptyEvents;
}
