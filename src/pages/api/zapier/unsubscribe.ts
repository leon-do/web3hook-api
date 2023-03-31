import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis";
import { GetStreamsEvmResponseAdapter } from "@moralisweb3/common-streams-utils";
import isAuthorized from "@/utils/isAuthorized";

if (!Moralis.Core.isStarted) {
  Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
}

type Data = {
  success: boolean;
};

// https://platform.zapier.com/docs/triggers#unsubscribe
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/zapier/unsubscribe");
    if (!req.body.webhookUrl) return res.status(400).send({ success: false });
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ success: false });
    // get streamId from moralis
    const id = await getStreamId(req.body.webhookUrl);
    if (!id) return res.status(400).send({ success: false });
    // delete webhook from moralis
    await Moralis.Streams.delete({ id });
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ success: false });
  }
}

// https://docs.moralis.io/web3-data-api/solana/reference/pagination#what-is-cursor-pagination
async function getStreamId(_zapierUrl: string): Promise<string | null> {
  let cursor = undefined;
  do {
    const response: any = await Moralis.Streams.getAll({ limit: 100, cursor: cursor });
    console.log(response);
    // console.log(response.jsonResponse);
    const zapierUrl = response.jsonResponse.result.filter((result: any) => result.description.includes(_zapierUrl));
    if (zapierUrl[0]?.id) return zapierUrl[0].id;
    cursor = response.jsonResponse.cursor;
  } while (cursor != "" && cursor != null);
  return null;
}
