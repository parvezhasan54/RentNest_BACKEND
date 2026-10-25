import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

const createMessageDB = async (p: {
  name?: string; email?: string; subject?: string; message?: string;
}) => {
  const name = p.name?.trim();
  const email = p.email?.trim();
  const subject = p.subject?.trim();
  const message = p.message?.trim();

  if (!name || !email || !subject || !message) {
    throw new AppError(HttpsStatus.BAD_REQUEST, "All fields are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError(HttpsStatus.BAD_REQUEST, "Enter a valid email");
  }
  if (message.length < 10 || message.length > 2000) {
    throw new AppError(HttpsStatus.BAD_REQUEST, "Message must be 10–2000 characters");
  }

  return prisma.contactMessage.create({ data: { name, email, subject, message } });
};

export const contactService = { createMessageDB };