import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Test the connection
export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log(" Database connected successfully");
    return true;
  } catch (error) {
    console.error(" Database connection failed:", error);
    return false;
  }
};

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
