import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/server/db";
import api from "../../../api.json";

export interface NumsNamesData extends Array<{ pageNum: number, name: string, id: number }> {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NumsNamesData | null>,
) {
  if (req.method !== "POST") return res.status(405).json(null);
  if(req.body.key !== api.key) return res.status(401).json(null);
  const getNames: NumsNamesData | null = await prisma.pages.findMany({
    distinct: ["pageNum"],
    select: {
      pageNum: true,
      name: true,
      id: true
    },
    orderBy:{
      pageNum: "asc"
    }
  });
  res.status(200).json(getNames);
}