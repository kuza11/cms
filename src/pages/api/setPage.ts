import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string } | null>) {
  if (req.method !== "POST") return res.status(405).json(null);
  if (req.body.key !== api.key) return res.status(401).json(null);
  if (!req.body.id) return res.status(404).json(null);
  let id: number = +req.body.id;
  if (isNaN(id)) return res.status(400).json(null);
  try {
    const page = await prisma.pages.findUnique({
      where: {
        id: id,
      },
    });
    if (!page) return res.status(404).json(null);
    const version = await prisma.pages.findFirst({
      where: {
        pageNum: page?.pageNum
      },
      select: {
        pageVersion: true
      },
      orderBy: {
        pageVersion: "desc"
      }
    }).then(res => res?.pageVersion ?? null)
    if(!version) return res.status(404).json(null)
    await prisma.pages.create({
      data: {
        pageNum: page.pageNum,
        pageVersion: version + 1,
        name: page.name,
        content: req.body.content
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
  res.status(200).json({ message: "ok" });
}
