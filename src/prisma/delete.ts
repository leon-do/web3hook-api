import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function prismaDelete(_url: string): Promise<boolean> {
  try {
    await prisma.trigger.delete({
      where: {
        webhookUrl: _url,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
