import type { NextApiRequest, NextApiResponse } from "next";
import absoluteUrl from "next-absolute-url";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import isAuthorized from "@/utils/isAuthorized";

if (!Moralis.Core.isStarted) {
  Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
}
type Data = {
  success: boolean;
};

// https://platform.zapier.com/docs/triggers#subscribe
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/api/zapier/subscribe");
    if (!req.body.webhookUrl) return res.status(400).send({ success: false });
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ success: false });
    await moralisAdd(req);
    return res.status(200).redirect(req.body.webhookUrl as string);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ success: false });
  }
}

async function moralisAdd(_req: NextApiRequest): Promise<string | null> {
  const chains = {
    "1": EvmChain.ETHEREUM,
    "5": EvmChain.GOERLI,
    "11155111": EvmChain.SEPOLIA,
    "137": EvmChain.POLYGON,
    "80001": EvmChain.MUMBAI,
    "56": EvmChain.BSC,
    "97": EvmChain.BSC_TESTNET,
    "43114": EvmChain.AVALANCHE,
    "43113": EvmChain.FUJI,
    "250": EvmChain.FANTOM,
    "25": EvmChain.CRONOS,
    "338": EvmChain.CRONOS_TESTNET,
    "11297108109": EvmChain.PALM,
    "42161": EvmChain.ARBITRUM,
    "10": EvmChain.create("10"), // OPTIMISM
  };

  try {
    // https://docs.moralis.io/streams-api/how-to-listen-to-all-erc20-contract-transfers-over-certain-amount-sent-by-specific-address#programmatically
    const stream = await Moralis.Streams.add({
      chains: [chains[_req.body.chainId as keyof typeof chains]],
      description: _req.body.webhookUrl,
      tag: _req.body.webhookUrl,
      abi: !_req.body.abi ? undefined : JSON.parse(_req.body.abi),
      topic0: !_req.body.abi ? undefined : [_req.body.event],
      webhookUrl: `${absoluteUrl(_req).protocol}//${absoluteUrl(_req).host}/api/moralis/hook`,
      includeContractLogs: true,
      includeNativeTxs: true,
      includeInternalTxs: true,
    });
    const { id } = stream.toJSON();
    await Moralis.Streams.addAddress({ id, address: _req.body.address });
    return id;
  } catch (error) {
    console.error(error);
    return null;
  }
}
