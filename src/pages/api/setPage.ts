// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  console.log(req.body);
  if (!req.body.id) return res.status(404).json(null);
  let id: number = +req.body.id;
  if (isNaN(id)) return res.status(404).json(null);
  try {
    await prisma.pages.update({
      where: {
        id: id,
      },
      data: {
        content: req.body.content,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
  res.status(200).json({ message: "ok" });
}
