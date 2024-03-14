import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export interface PageData extends Object {
  id: number;
  hidden: boolean;
  pageNum: number;
  pageVersion: number;
  name: string;
  content: string | null;
  date: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PageData | null>) {
  if (req.method !== "POST") {
    prisma.$disconnect();
    return res.status(405).json(null);
  }
  if (req.body.key !== api.key) {
    prisma.$disconnect();
    return res.status(401).json(null);
  }
  if (!req.query.num) {
    prisma.$disconnect();
    return res.status(404).json(null);
  }
  let num: number = +req.query.num;
  let version: number | null = null;
  if (req.query.version && req.query.version != "null") version = +req.query.version;
  if (version != null && isNaN(version)) {
    prisma.$disconnect();
    return res.status(400).json(null);
  }
  if (isNaN(num)) {
    prisma.$disconnect();
    return res.status(400).json(null);
  }
  const edit: boolean = req.body.edit ? req.body.edit : false;

  let getPage: PageData | null = null;

  if (edit) {
    if (version == null) {
      getPage = await prisma.pages.findFirst({
        where: {
          pageNum: num,
        },
        select: {
          id: true,
          hidden: true,
          pageNum: true,
          pageVersion: true,
          name: true,
          content: true,
          date: true,
        },
        orderBy: {
          pageVersion: "desc",
        },
      });
    } else {
      getPage = await prisma.pages.findFirst({
        where: {
          pageNum: num,
          pageVersion: version,
        },
        select: {
          id: true,
          hidden: true,
          pageNum: true,
          pageVersion: true,
          name: true,
          content: true,
          date: true,
        },
      });
    }
  } else {
    if (version == null) {
      getPage = await prisma.pages.findFirst({
        where: {
          pageNum: num,
          hidden: false,
        },
        select: {
          id: true,
          hidden: true,
          pageNum: true,
          pageVersion: true,
          name: true,
          content: true,
          date: true,
        },
        orderBy: {
          pageVersion: "desc",
        },
      });
    } else {
      getPage = await prisma.pages.findFirst({
        where: {
          pageNum: num,
          pageVersion: version,
          hidden: false,
        },
        select: {
          id: true,
          hidden: true,
          pageNum: true,
          pageVersion: true,
          name: true,
          content: true,
          date: true,
        },
      });
    }
  }
  res.status(200).json(getPage);
  prisma.$disconnect();
}
