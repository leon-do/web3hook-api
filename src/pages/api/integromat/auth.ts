import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import isAuthorized from "@/utils/isAuthorized";

const providers: Providers = {
  "1": new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth"),
  "5": new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli"),
  "11155111": new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia"),
  "137": new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com"),
  "80001": new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com"),
  "56": new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org"),
  "97": new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545"),
  "43114": new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"),
  "43113": new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc"),
  "250": new ethers.providers.JsonRpcProvider("https://rpcapi.fantom.network"),
  "25": new ethers.providers.JsonRpcProvider("https://evm.cronos.org"),
  "338": new ethers.providers.JsonRpcProvider("https://evm-t3.cronos.org"),
  "11297108109": new ethers.providers.JsonRpcProvider("https://palm-mainnet.public.blastapi.io"),
  "42161": new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
  "5001": new ethers.providers.JsonRpcProvider("https://rpc.testnet.mantle.xyz"),
  "10": new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/optimism"),
  "7700": new ethers.providers.JsonRpcProvider("https://canto.slingshot.finance"),
  "7701": new ethers.providers.JsonRpcProvider("https://canto-testnet.plexnode.wtf"),
};

type Providers = {
  [key: string]: ethers.providers.JsonRpcProvider;
};

type Data = {
  data: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    console.log("/integromat/auth");
    if (!(await isAuthorized(req.body.license_key))) return res.status(400).send({ data: "Invalid License Key" });
    return res.status(200).send({ data: "success" });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ data: error.message as string });
  }
}
