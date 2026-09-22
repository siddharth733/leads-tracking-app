import { prisma } from "../lib/prisma.js";

interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
  status?: "new" | "contacted" | "qualified" | "lost";
}

export const createLead = async (data: CreateLeadData) => {
  return prisma.lead.create({
    data,
  });
};
