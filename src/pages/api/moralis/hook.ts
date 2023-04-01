import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ethers } from "ethers";

type MoralisBody = {
  confirmed: boolean;
  chainId: string; // hex
  streamId: string;
  txs: {
    hash: string;
    fromAddress: string;
    toAddress: string;
    value: string;
    gas: string;
  }[];
  abi: string[];
  logs: Logs[];
  tag: string;
};

type Logs = {
  data: string;
  topic0: string;
  topic1: string;
  topic2: string;
  topic3: string;
};

type HookResponse = {
  transactionHash: string;
  fromAddress?: string;
  toAddress?: string;
  value?: string;
  chainId?: number;
  data?: string;
  gasLimit?: string;
  [key: string]: any;
};

type Data = {
  success: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const moralisBody: MoralisBody = req.body;
    // only send pending txs
    if (moralisBody.confirmed) return res.status(200).json({ success: true });
    // if no abi then POST transaction
    if (moralisBody.abi.length === 0 && moralisBody.txs.length > 0) {
      const transactionResponse: HookResponse = getTransactionResponse(moralisBody);
      await axios.post(moralisBody.tag, transactionResponse);
    }
    // if abi then POST event
    if (moralisBody.abi.length > 0 && moralisBody.txs.length > 0) {
      const eventResponse: HookResponse = getEventResponse(moralisBody);
      await axios.post(moralisBody.tag, eventResponse);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(200).send({ success: false });
  }
}

function getTransactionResponse(_moralisBody: MoralisBody): HookResponse {
  return {
    transactionHash: _moralisBody.txs[0].hash,
    fromAddress: _moralisBody.txs[0].fromAddress,
    toAddress: _moralisBody.txs[0].toAddress,
    value: _moralisBody.txs[0].value,
    chainId: parseInt(_moralisBody.chainId, 16),
    data: _moralisBody.logs[0]?.data || "",
    gasLimit: _moralisBody.txs[0].gas,
  };
}

function getEventResponse(_moralisBody: MoralisBody): HookResponse {
  // parse parameters from moralis tag
  const event = _moralisBody.tag.split("event=")[1];
  if (!_moralisBody.abi || !event || Array.isArray(event)) throw new Error("No ABI | No Event");
  const hookResponse: HookResponse = { transactionHash: _moralisBody.txs[0].hash };
  const iface = new ethers.utils.Interface(_moralisBody.abi);
  // create empty object for each event
  const eventName = iface.events[event].name;
  iface.events[event].inputs.forEach((input) => {
    hookResponse[`${eventName}_${input.name}`] = null;
  });
  // convert topic0, topic1 etc to array
  let topics = [];
  for (let topic of ["topic0", "topic1", "topic2", "topic3"]) {
    if (_moralisBody.logs[0][topic as keyof Logs]) {
      topics.push(_moralisBody.logs[0][topic as keyof Logs]);
    }
  }
  const eventSignature = iface.parseLog({ data: _moralisBody.logs[0].data, topics });
  // fill event object with values from eventSignature
  for (const key in eventSignature.args) {
    if (!isNaN(Number(key))) continue;
    const eventName = eventSignature.name;
    hookResponse[`${eventName}_${key}`] = eventSignature.args[key].toString();
  }
  return hookResponse;
}
