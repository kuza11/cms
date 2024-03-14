import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  if (req.method !== "POST") return res.status(405).json(null);
  if (req.body.key !== api.key) return res.status(401).json(null);
  try {
    const num = await prisma.pages.findFirst({
      select: {
        pageNum: true
      },
      orderBy: {
        pageNum: "desc"
      }
    }).then(res => res?.pageNum ?? null)
    if(!num) return res.status(404).json(null)
    await prisma.pages.create({
      data: {
        pageNum: num + 1,
        name: `Test Page ${num + 1}`,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
  res.status(200).json({ message: "ok" });
}
