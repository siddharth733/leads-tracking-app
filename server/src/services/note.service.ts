import { prisma } from "../lib/prisma.js";

export const getNotesByLeadId = async (leadId: number) => {
  return prisma.note.findMany({
    where: {
      leadId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createNote = async (leadId: number, content: string) => {
  return prisma.note.create({
    data: {
      leadId,
      content,
    },
  });
};
