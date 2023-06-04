import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  label: string;
  value: string;
};

type Error = {
  error: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data[] | Error>) {
  try {
    const abi = JSON.parse(req.body.abi);
    const choices = abi
      .filter((item: any) => item.type === "function" && item.stateMutability === "view")
      .map((item: any) => ({
        label: `${item.name}(${item.inputs.map((input: any) => `${input.type} ${input.name}`).join(",")})`,
        value: item.name,
      }));

    res.status(200).send(choices);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: "Invalid ABI" });
  }
}
