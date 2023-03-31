import type { NextApiRequest, NextApiResponse } from "next";

type PerformList = {
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  chainId: number;
  data: string;
  gasLimit: string;
};

// https://platform.zapier.com/docs/faq#i-get-a-trigger-error-saying-that-an-array-is-expected-how-do-i-fix-it
export default async function handler(req: NextApiRequest, res: NextApiResponse<PerformList[]>) {
  console.log("/zapier/transactionPerformList");
  return res.status(200).send([
    {
      transactionHash: "0x0",
      fromAddress: "0x0",
      toAddress: "0x0",
      value: "100",
      chainId: 1,
      data: "0x0",
      gasLimit: "21000",
    },
  ]);
}
