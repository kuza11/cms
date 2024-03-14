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
  if (req.method !== "POST") {
    prisma.$disconnect();
    return res.status(405).json(null);
  }
  if (req.body.key !== api.key) {
    prisma.$disconnect();
    return res.status(401).json(null);
  }
  if (!req.body.id) {
    prisma.$disconnect();
    return res.status(404).json(null);
  }
  let id: number = +req.body.id;
  if (isNaN(id)) {
    prisma.$disconnect();
    return res.status(400).json(null);
  }
  try {
    const page = await prisma.pages.findUnique({
      where: {
        id: id,
      },
    });
    if (!page) {
      prisma.$disconnect();
      return res.status(404).json(null);
    }
    const version = await prisma.pages
      .findFirst({
        where: {
          pageNum: page?.pageNum,
        },
        select: {
          pageVersion: true,
        },
        orderBy: {
          pageVersion: "desc",
        },
      })
      .then((res: { pageVersion: number } | null) => res?.pageVersion ?? null);
    if (!version) {
      prisma.$disconnect();
      return res.status(404).json(null);
    }
    await prisma.pages.create({
      data: {
        pageNum: page.pageNum,
        pageVersion: version + 1,
        name: page.name,
        content: req.body.content,
      },
    });
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
    return res.status(500).json({ message: "error" });
  }
  prisma.$disconnect();
  res.status(200).json({ message: "ok" });
}
