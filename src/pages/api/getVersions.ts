import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export interface VersionsData
  extends Array<{
    id: number;
    pageVersion: number;
    name: string;
    date: Date;
    hidden: boolean;
  }> {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VersionsData | null>) {
  if (req.method !== "POST") return res.status(405).json(null);
  if (req.body.key !== api.key) return res.status(401).json(null);
  if (!req.query.num) return res.status(404).json(null);
  let num: number = +req.query.num;
  if (isNaN(num)) return res.status(400).json(null);
  const getVersions: VersionsData | null = await prisma.pages.findMany({
    where: {
      pageNum: num,
    },
    select: {
      id: true,
      pageVersion: true,
      name: true,
      date: true,
      hidden: true,
    },
    orderBy: {
      pageVersion: "desc",
    },
  });
  res.status(200).json(getVersions);
}
