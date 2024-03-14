import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export interface NumsNamesData extends Array<{ pageNum: number; name: string; id: number; hidden: boolean }> {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<NumsNamesData | null>) {
  if (req.method !== "POST") {
    prisma.$disconnect();
    return res.status(405).json(null);
  }
  if (req.body.key !== api.key) {
    prisma.$disconnect();
    return res.status(401).json(null);
  }
  const edit: boolean = req.body.edit ? req.body.edit : false;
  const getNames: NumsNamesData | null = edit
    ? await prisma.pages.findMany({
        distinct: ["pageNum"],
        select: {
          pageNum: true,
          name: true,
          id: true,
          hidden: true,
        },
        orderBy: {
          pageNum: "asc",
        },
      })
    : await prisma.pages.findMany({
        distinct: ["pageNum"],
        where: {
          hidden: false,
        },
        select: {
          pageNum: true,
          name: true,
          id: true,
          hidden: true,
        },
        orderBy: {
          pageNum: "asc",
        },
      });

  if (edit) {
    let getNamesEdited: NumsNamesData = [];
    getNames.forEach(async (e) => {
      const getName = await prisma.pages.findFirst({
        where: {
          pageNum: e.pageNum,
        },
        select: {
          pageNum: true,
          name: true,
        },
        orderBy: {
          pageVersion: "desc",
        },
      });
      getNamesEdited.push({
        pageNum: e.pageNum,
        name: getName?.name ?? e.name,
        id: e.id,
        hidden: e.hidden,
      });
      if (getNamesEdited.length == getNames.length) {
        res.status(200).json(getNamesEdited.sort((a, b) => a.pageNum - b.pageNum));
        prisma.$disconnect();
      }
    });
  } else {
    res.status(200).json(getNames);
    prisma.$disconnect();
  }
}
