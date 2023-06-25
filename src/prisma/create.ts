import type { NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function create(_req: NextApiRequest): Promise<boolean> {
  try {
    const x = await prisma.trigger.create({
      data: {
        webhookUrl: _req.body.webhookUrl,
        chainId: Number(_req.body.chainId),
        address: _req.body.address.toLowerCase(),
        abi: !_req.body.abi ? null : _req.body.abi,
        event: !_req.body.event ? null : _req.body.event,
        lemonsqueezy: _req.body.license_key,
      },
    });
    console.log(x)
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
