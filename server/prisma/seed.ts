import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client.js";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.note.deleteMany();
  await prisma.lead.deleteMany();

  // Create leads with notes
  const lead1 = await prisma.lead.create({
    data: {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+1-555-0192",
      status: "new",
      notes: {
        create: [
          { content: "Inquired about enterprise plan via contact form." },
          { content: "Scheduled initial discovery call for tomorrow at 2 PM." },
        ],
      },
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "Bob Smith",
      email: "bob.smith@techcorp.io",
      phone: "+1-555-0148",
      status: "contacted",
      notes: {
        create: [
          { content: "Completed discovery call. Sent product brochure." },
        ],
      },
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      name: "Carla Gomez",
      email: "carla.gomez@innovate.co",
      phone: "+1-555-0173",
      status: "qualified",
      notes: {
        create: [
          { content: "Budget confirmed ($50k+). Decision maker." },
          { content: "Demo presentation went exceptionally well." },
          { content: "Contract sent for review." },
        ],
      },
    },
  });

  const lead4 = await prisma.lead.create({
    data: {
      name: "David Lee",
      email: "david.lee@legacy.net",
      phone: "+1-555-0131",
      status: "lost",
      notes: {
        create: [
          { content: "Selected a competitor due to legacy integration requirements." },
        ],
      },
    },
  });

  console.log(`Database seeded successfully! Created leads: ${lead1.name}, ${lead2.name}, ${lead3.name}, ${lead4.name}`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
