import type { NextApiRequest, NextApiResponse } from "next";
import isAuthorized from "@/utils/isAuthorized";

type Data = {
  key: string;
  label: string;
}[];

// create dynamic events for zapier
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/zapier/getEvents");
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send([]);
    const abi = JSON.parse(req.body.abi || "[]");
    const events = abi
      .filter((item: any) => item.type === "event")
      .map((item: any) => {
        const inputs = item.inputs.map((input: any) => input.type).join(",");
        return { id: `${item.name}(${inputs})`, event: `${item.name}(${inputs})` };
      });
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(400).json([]);
  }
}
